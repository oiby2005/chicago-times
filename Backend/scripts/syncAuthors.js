const db = require('../config/db');

async function syncAllAuthors() {
  try {
    const [users] = await db.query('SELECT id, full_name, email FROM users');
    const userMap = {};
    for (const u of users) {
      if (u.email) {
        userMap[u.email.toLowerCase().trim()] = u.full_name || '';
      }
    }

    // 1. Update posts author column where authorEmail matches
    for (const [email, name] of Object.entries(userMap)) {
      if (name && name.trim()) {
        await db.query(
          'UPDATE posts SET author = ? WHERE LOWER(authorEmail) = ?',
          [name.trim(), email]
        );
      }
    }

    // 2. Update sub_writers JSON in posts table
    const [posts] = await db.query(
      "SELECT id, sub_writers FROM posts WHERE sub_writers IS NOT NULL AND sub_writers != '' AND sub_writers != '[]'"
    );

    for (const p of posts) {
      let subs = [];
      try {
        subs = typeof p.sub_writers === 'string' ? JSON.parse(p.sub_writers) : p.sub_writers;
      } catch (e) {}

      if (Array.isArray(subs) && subs.length > 0) {
        let changed = false;
        const updatedSubs = subs.map((sw) => {
          const swEmail = (sw.email || '').toLowerCase().trim();
          if (userMap[swEmail]) {
            const currentName = userMap[swEmail];
            if (currentName && currentName !== sw.name) {
              changed = true;
              return {
                ...sw,
                name: currentName,
                full_name: currentName,
                slug: currentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
              };
            }
          }
          return sw;
        });

        if (changed) {
          await db.query('UPDATE posts SET sub_writers = ? WHERE id = ?', [JSON.stringify(updatedSubs), p.id]);
          console.log(`Updated sub_writers for post ${p.id}`);
        }
      }
    }

    console.log('Sync complete');
    process.exit(0);
  } catch (err) {
    console.error('Sync error:', err);
    process.exit(1);
  }
}

syncAllAuthors();
