const db = require('../config/db');

// In-memory fallback post array if MySQL database table is empty or offline
let memoryPosts = [];

// Helper to normalize post structure
const normalizePost = (p) => ({
  id: String(p.id || "post_" + Date.now()),
  title: p.title || "Untitled",
  subheadline: p.subheadline || p.subtitle || "",
  bodyContent: p.bodyContent || p.content || "",
  category: p.category || "Business",
  subCategories: Array.isArray(p.subCategories) ? p.subCategories : [],
  tags: Array.isArray(p.tags) ? p.tags : [],
  readDuration: p.readDuration || p.readTime || "5 min read",
  isExclusive: p.isExclusive ?? true,
  author: p.author || "Writer User",
  authorAvatar: p.authorAvatar || "",
  authorRole: p.authorRole || "writer",
  status: p.status || "Published",
  homepagePlacement: p.homepagePlacement || "None",
  thumbnail: p.thumbnail || p.coverImage || p.imageUrl || "",
  date: p.date || p.submittedDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  publishedAt: p.publishedAt || Date.now(),
  views: p.views || 0,
});

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    try {
      const [rows] = await db.query('SELECT * FROM posts ORDER BY id DESC');
      if (rows && rows.length > 0) {
        const posts = rows.map((r) => {
          let extra = {};
          try { extra = JSON.parse(r.extra_data || '{}'); } catch(e) {}
          return {
            id: String(r.id),
            title: r.title,
            subheadline: r.subheadline || "",
            bodyContent: r.body_content || "",
            category: r.category,
            status: r.status,
            author: r.author,
            thumbnail: r.thumbnail || "",
            ...extra,
          };
        });
        return res.status(200).json({ success: true, posts });
      }
    } catch (dbErr) {
      console.warn("MySQL DB Query Warning for posts:", dbErr.message);
    }

    return res.status(200).json({ success: true, posts: memoryPosts });
  } catch (error) {
    console.error('getPosts error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching posts.' });
  }
};

// @desc    Create or update post
// @route   POST /api/posts
const savePost = async (req, res) => {
  try {
    const postData = req.body;
    if (!postData || !postData.title) {
      return res.status(400).json({ success: false, message: 'Post title is required.' });
    }

    const post = normalizePost(postData);

    // Upsert into memory fallback array
    const existingIndex = memoryPosts.findIndex((p) => p.id === post.id);
    if (existingIndex >= 0) {
      memoryPosts[existingIndex] = { ...memoryPosts[existingIndex], ...post };
    } else {
      memoryPosts.unshift(post);
    }

    // Attempt DB Upsert if table exists
    try {
      const extraData = JSON.stringify({
        subCategories: post.subCategories,
        tags: post.tags,
        readDuration: post.readDuration,
        isExclusive: post.isExclusive,
        homepagePlacement: post.homepagePlacement,
        date: post.date,
        publishedAt: post.publishedAt,
        authorAvatar: post.authorAvatar,
      });

      await db.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id VARCHAR(100) PRIMARY KEY,
          title TEXT NOT NULL,
          subheadline TEXT,
          body_content LONGTEXT,
          category VARCHAR(100),
          status VARCHAR(50),
          author VARCHAR(150),
          thumbnail TEXT,
          extra_data LONGTEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);

      await db.query(`
        INSERT INTO posts (id, title, subheadline, body_content, category, status, author, thumbnail, extra_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          subheadline = VALUES(subheadline),
          body_content = VALUES(body_content),
          category = VALUES(category),
          status = VALUES(status),
          author = VALUES(author),
          thumbnail = VALUES(thumbnail),
          extra_data = VALUES(extra_data);
      `, [post.id, post.title, post.subheadline, post.bodyContent, post.category, post.status, post.author, post.thumbnail, extraData]);

    } catch (dbErr) {
      console.warn("MySQL DB Save Warning for post:", dbErr.message);
    }

    return res.status(200).json({ success: true, message: 'Post saved successfully', post });
  } catch (error) {
    console.error('savePost error:', error);
    return res.status(500).json({ success: false, message: 'Server error saving post.' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    memoryPosts = memoryPosts.filter((p) => String(p.id) !== String(id));

    try {
      await db.query('DELETE FROM posts WHERE id = ?', [id]);
    } catch (dbErr) {}

    return res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('deletePost error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting post.' });
  }
};

module.exports = {
  getPosts,
  savePost,
  deletePost,
};
