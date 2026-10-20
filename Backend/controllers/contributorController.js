const db = require('../config/db');
const { sendContributorWarningEmail, sendContributorSuspensionEmail } = require('../lib/mailer');

const WEEKLY_TARGET = 4;
const MONTHLY_TARGET = 16;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Calculate published articles for a given author within a time range
 */
async function countPublishedArticles(email, startTimestampMs, endTimestampMs = Date.now()) {
  try {
    const cleanEmail = (email || '').toLowerCase().trim();
    const startDate = new Date(startTimestampMs);
    const endDate = new Date(endTimestampMs);

    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM posts 
       WHERE LOWER(authorEmail) = ? 
         AND status IN ('Pending review', 'Published') 
         AND (
           (publishedAt >= ? AND publishedAt <= ?) 
           OR 
           (created_at >= ? AND created_at <= ?)
         )`,
      [cleanEmail, startTimestampMs, endTimestampMs, startDate, endDate]
    );

    return (rows && rows[0] && rows[0].count) ? Number(rows[0].count) : 0;
  } catch (err) {
    console.error('Error counting published articles for contributor:', err);
    return 0;
  }
}

/**
 * Check and evaluate quota for a specific contributor user object
 */
async function evaluateContributor(user) {
  if (!user || (user.writer_type || '').toLowerCase() !== 'contributor') {
    return { is_contributor: false, writer_type: user?.writer_type || 'staff' };
  }

  const now = Date.now();
  let cycleStartMs = user.cycle_started_at ? new Date(user.cycle_started_at).getTime() : new Date(user.created_at || now).getTime();
  if (isNaN(cycleStartMs) || cycleStartMs <= 0) {
    cycleStartMs = now;
  }

  // If already blocked, return blocked status
  if (Boolean(user.is_blocked)) {
    return {
      is_contributor: true,
      writer_type: 'contributor',
      is_blocked: true,
      block_reason: user.block_reason || 'Contributor account suspended due to unmet publication quota.',
      weeklyTarget: WEEKLY_TARGET,
      monthlyTarget: MONTHLY_TARGET,
    };
  }

  let elapsedMs = now - cycleStartMs;

  // Check if current 7-day cycle has expired
  if (elapsedMs >= WEEK_MS) {
    // Check how many published in the finished 7-day window
    const publishedInExpiredCycle = await countPublishedArticles(user.email, cycleStartMs, cycleStartMs + WEEK_MS);
    
    if (publishedInExpiredCycle < WEEKLY_TARGET) {
      // Failed weekly quota -> AUTO BLOCK!
      const blockReason = `Suspended: Unmet weekly quota (${publishedInExpiredCycle}/${WEEKLY_TARGET} articles published in 7-day cycle).`;
      await db.query(
        'UPDATE users SET is_blocked = 1, block_reason = ? WHERE id = ?',
        [blockReason, user.id]
      ).catch(() => {});

      console.log(`[CONTRIBUTOR AUTO-BLOCKED] ${user.email} - ${blockReason}`);
      sendContributorSuspensionEmail({
        name: user.full_name,
        email: user.email,
        weeklyPublished: publishedInExpiredCycle,
        weeklyTarget: WEEKLY_TARGET,
      }).catch(console.error);

      return {
        is_contributor: true,
        writer_type: 'contributor',
        is_blocked: true,
        block_reason: blockReason,
        weeklyTarget: WEEKLY_TARGET,
        monthlyTarget: MONTHLY_TARGET,
        weeklyPublished: publishedInExpiredCycle,
      };
    } else {
      // Completed 7-day cycle successfully -> Advance cycle
      const cyclesToAdvance = Math.floor(elapsedMs / WEEK_MS);
      cycleStartMs = cycleStartMs + (cyclesToAdvance * WEEK_MS);
      elapsedMs = now - cycleStartMs;

      await db.query(
        'UPDATE users SET cycle_started_at = ?, last_warning_email_sent = NULL WHERE id = ?',
        [new Date(cycleStartMs), user.id]
      ).catch(() => {});
    }
  }

  // Also check 30-day monthly cycle (if account is >= 30 days old)
  const monthStartMs = now - MONTH_MS;
  const monthlyPublished = await countPublishedArticles(user.email, monthStartMs, now);

  const accountAgeMs = now - new Date(user.created_at || now).getTime();
  if (accountAgeMs >= MONTH_MS && monthlyPublished < MONTHLY_TARGET) {
    const blockReason = `Suspended: Unmet monthly quota (${monthlyPublished}/${MONTHLY_TARGET} articles published in 30-day period).`;
    await db.query(
      'UPDATE users SET is_blocked = 1, block_reason = ? WHERE id = ?',
      [blockReason, user.id]
    ).catch(() => {});

    console.log(`[CONTRIBUTOR AUTO-BLOCKED MONTHLY] ${user.email} - ${blockReason}`);
    sendContributorSuspensionEmail({
      name: user.full_name,
      email: user.email,
      weeklyPublished: monthlyPublished,
      weeklyTarget: MONTHLY_TARGET,
    }).catch(console.error);

    return {
      is_contributor: true,
      writer_type: 'contributor',
      is_blocked: true,
      block_reason: blockReason,
      weeklyTarget: WEEKLY_TARGET,
      monthlyTarget: MONTHLY_TARGET,
      monthlyPublished,
    };
  }

  // Active current 7-day cycle metrics
  const weeklyPublished = await countPublishedArticles(user.email, cycleStartMs, now);
  const weeklyRemaining = Math.max(0, WEEKLY_TARGET - weeklyPublished);
  const monthlyRemaining = Math.max(0, MONTHLY_TARGET - monthlyPublished);

  const msLeft = Math.max(0, WEEK_MS - elapsedMs);
  const daysLeft = Math.max(1, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
  const dayOfCycle = Math.min(7, Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1);

  // Day 5+ Warning Email Trigger:
  // "from the 7 days when the 5th day till you have left articles to publish in 7 days, you have to send an email for that contributors telling you have left 3 more to publish in this week, minimum this number of articles should be published, if not your account will suspended."
  const isWarningPeriod = dayOfCycle >= 5 && weeklyRemaining > 0;
  if (isWarningPeriod) {
    const lastSent = user.last_warning_email_sent ? new Date(user.last_warning_email_sent).getTime() : 0;
    // Only send once per 24 hours to avoid spamming
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (!lastSent || (now - lastSent) >= TWENTY_FOUR_HOURS) {
      console.log(`[TRIGGERING DAY 5+ EMAIL WARNING] To ${user.email}: ${weeklyRemaining} articles left in ${daysLeft} days`);
      sendContributorWarningEmail({
        name: user.full_name,
        email: user.email,
        remainingArticles: weeklyRemaining,
        daysLeft,
        weeklyTarget: WEEKLY_TARGET,
      }).catch(console.error);

      await db.query(
        'UPDATE users SET last_warning_email_sent = NOW() WHERE id = ?',
        [user.id]
      ).catch(() => {});
    }
  }

  return {
    is_contributor: true,
    writer_type: 'contributor',
    is_blocked: false,
    block_reason: null,
    weeklyTarget: WEEKLY_TARGET,
    weeklyPublished,
    weeklyRemaining,
    monthlyTarget: MONTHLY_TARGET,
    monthlyPublished,
    monthlyRemaining,
    cycleStartMs,
    cycleEndMs: cycleStartMs + WEEK_MS,
    msLeft,
    daysLeft,
    dayOfCycle,
    isWarningPeriod,
  };
}

/**
 * Controller endpoint: GET /api/contributors/quota-status
 */
async function getQuotaStatus(req, res) {
  try {
    const email = (req.query.email || req.user?.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const [rows] = await db.query(
      'SELECT id, full_name, email, role, writer_type, is_blocked, block_reason, cycle_started_at, last_warning_email_sent, created_at FROM users WHERE LOWER(email) = ?',
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    const status = await evaluateContributor(user);

    return res.status(200).json({
      success: true,
      ...status,
    });
  } catch (err) {
    console.error('Error fetching contributor quota status:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Background periodic check for all active contributors
 */
async function checkAllContributorsQuota() {
  try {
    const [contributors] = await db.query(
      "SELECT id, full_name, email, role, writer_type, is_blocked, block_reason, cycle_started_at, last_warning_email_sent, created_at FROM users WHERE LOWER(role) = 'writer' AND LOWER(writer_type) = 'contributor'"
    );

    if (contributors && contributors.length > 0) {
      for (const c of contributors) {
        await evaluateContributor(c).catch(console.error);
      }
    }
  } catch (err) {
    console.error('Error during periodic contributor quota check:', err.message);
  }
}

module.exports = {
  getQuotaStatus,
  evaluateContributor,
  checkAllContributorsQuota,
};
