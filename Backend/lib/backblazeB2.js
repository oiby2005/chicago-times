const fs = require('fs');
require('dotenv').config();

let b2AuthCache = {
  authToken: null,
  apiUrl: null,
  downloadUrl: null,
  accountNumber: null,
  bucketId: null,
  bucketName: null,
  expiresAt: 0,
};

async function getB2Auth() {
  const keyId = process.env.B2_APPLICATION_KEY_ID || process.env.B2_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY || process.env.B2_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!keyId || !applicationKey) {
    return null;
  }

  const now = Date.now();
  if (b2AuthCache.authToken && b2AuthCache.expiresAt > now) {
    return b2AuthCache;
  }

  try {
    const credentials = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
    const res = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!res.ok) {
      console.warn('Backblaze B2 Authorization failed:', res.statusText);
      return null;
    }

    const data = await res.json();
    b2AuthCache = {
      authToken: data.authorizationToken,
      apiUrl: data.apiUrl,
      downloadUrl: data.downloadUrl,
      accountNumber: data.accountId,
      bucketId: data.allowed?.bucketId || null,
      bucketName: data.allowed?.bucketName || null,
      expiresAt: now + 12 * 60 * 60 * 1000,
    };
    return b2AuthCache;
  } catch (err) {
    console.warn('Backblaze B2 Auth error:', err.message);
    return null;
  }
}

async function uploadToBackblazeB2(fileBuffer, fileName = 'image.webp', mimeType = 'image/webp', folder = '') {
  const auth = await getB2Auth();
  const bucketName = process.env.B2_BUCKET_NAME || auth?.bucketName;
  let bucketId = process.env.B2_BUCKET_ID || auth?.bucketId;

  if (!auth || !bucketName) {
    return null;
  }

  try {
    if (!bucketId) {
      const listRes = await fetch(`${auth.apiUrl}/b2api/v2/b2_list_buckets`, {
        method: 'POST',
        headers: {
          Authorization: auth.authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: auth.accountNumber }),
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const found = (listData.buckets || []).find((b) => b.bucketName === bucketName);
        if (found) bucketId = found.bucketId;
      }
    }

    if (!bucketId) {
      console.warn(`Backblaze B2 Bucket "${bucketName}" not found.`);
      return null;
    }

    const uploadUrlRes = await fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        Authorization: auth.authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bucketId }),
    });

    if (!uploadUrlRes.ok) {
      console.warn('Failed to get Backblaze B2 upload URL');
      return null;
    }

    const uploadUrlData = await uploadUrlRes.json();

    // Determine target file path with folder prefix (avatars/, articles/, ads/, etc.)
    let targetPath = fileName;
    if (folder && !targetPath.startsWith(`${folder}/`)) {
      targetPath = `${folder}/${targetPath}`;
    } else if (!targetPath.includes('/')) {
      if (targetPath.startsWith('avatar_')) targetPath = `avatars/${targetPath}`;
      else if (targetPath.startsWith('article_') || targetPath.startsWith('thumb_') || targetPath.startsWith('body_')) targetPath = `articles/${targetPath}`;
      else if (targetPath.startsWith('ad_')) targetPath = `ads/${targetPath}`;
      else targetPath = `articles/${targetPath}`;
    }

    // Sanitize target path keeping forward slashes intact for virtual folder structure
    const cleanFileName = targetPath.replace(/[^a-zA-Z0-9._\-\/]/g, '_');

    const uploadRes = await fetch(uploadUrlData.uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: uploadUrlData.authorizationToken,
        'X-Bz-File-Name': encodeURIComponent(cleanFileName),
        'Content-Type': mimeType,
        'X-Bz-Content-Sha1': 'do_not_verify',
      },
      body: fileBuffer,
    });

    if (uploadRes.ok) {
      const publicUrl = `${auth.downloadUrl}/file/${bucketName}/${cleanFileName}`;
      console.log('✅ Backblaze B2 Image Uploaded Successfully:', publicUrl);
      return publicUrl;
    } else {
      const errText = await uploadRes.text();
      console.warn('Backblaze B2 File Upload failed:', uploadRes.status, uploadRes.statusText, errText);
      return null;
    }
  } catch (err) {
    console.error('Backblaze B2 Upload Error:', err.message);
    return null;
  }
}

async function uploadBase64ToB2(base64Data, defaultName = 'image.webp', folder = '') {
  if (!base64Data || !base64Data.startsWith('data:image/')) return null;

  try {
    const matches = base64Data.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimeType.split('/')[1] || 'webp';
    const cleanNameWithoutExt = defaultName.replace(/\.[^/.]+$/, '');
    const fileName = `${cleanNameWithoutExt}.${ext}`;

    return await uploadToBackblazeB2(buffer, fileName, mimeType, folder);
  } catch (e) {
    console.error('Error processing base64 image for Backblaze B2 upload:', e);
    return null;
  }
}

async function uploadAllBase64InHtml(htmlContent, prefix = 'article', folder = 'articles') {
  if (!htmlContent || typeof htmlContent !== 'string' || !htmlContent.includes('data:image/')) {
    return htmlContent;
  }

  let updatedHtml = htmlContent;
  const imgRegex = /src=["'](data:image\/[a-zA-Z+]+;base64,[^"']+)["']/g;
  let match;
  const matches = [];

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    matches.push(match[1]);
  }

  for (let i = 0; i < matches.length; i++) {
    const base64Str = matches[i];
    try {
      const b2Url = await uploadBase64ToB2(base64Str, `${prefix}_img_${Date.now()}_${i}.webp`, folder);
      if (b2Url) {
        updatedHtml = updatedHtml.split(base64Str).join(b2Url);
      }
    } catch (e) {
      console.warn('Error uploading HTML inline image to Backblaze B2:', e);
    }
  }

  return updatedHtml;
}

async function uploadRemoteUrlToB2(remoteUrl, defaultName = 'cover_img', folder = 'cover images') {
  if (!remoteUrl || typeof remoteUrl !== 'string') return null;
  if (!remoteUrl.startsWith('http://') && !remoteUrl.startsWith('https://')) return null;

  let targetUrl = remoteUrl;
  if (targetUrl.includes('mzstatic.com')) {
    targetUrl = targetUrl.replace(/\/\d+x\d+[^/]*\.(jpg|png|webp).*$/i, '/1200x1200bb.jpg');
    if (!targetUrl.endsWith('/1200x1200bb.jpg') && targetUrl.includes('.jpg')) {
      targetUrl = targetUrl.split('?')[0].replace(/\.jpg\/.*$/i, '.jpg/1200x1200bb.jpg');
    }
  }

  try {
    let res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok && targetUrl !== remoteUrl) {
      // Retry with original URL if cleaned URL failed
      res = await fetch(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
    }

    if (!res.ok) {
      console.warn('Failed to fetch remote image for B2 upload:', remoteUrl, res.statusText);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = res.headers.get('content-type') || 'image/jpeg';
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const cleanName = `${defaultName.replace(/\.[^/.]+$/, '')}_${Date.now()}.${ext}`;

    return await uploadToBackblazeB2(buffer, cleanName, mimeType, folder);
  } catch (err) {
    console.error('Error uploading remote URL to Backblaze B2:', err.message);
    return null;
  }
}

async function listBackblazeFiles(prefix = 'backups/') {
  const auth = await getB2Auth();
  const bucketName = process.env.B2_BUCKET_NAME || auth?.bucketName;
  let bucketId = process.env.B2_BUCKET_ID || auth?.bucketId;

  if (!auth || !bucketName) return [];

  try {
    if (!bucketId) {
      const listRes = await fetch(`${auth.apiUrl}/b2api/v2/b2_list_buckets`, {
        method: 'POST',
        headers: {
          Authorization: auth.authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: auth.accountNumber }),
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const found = (listData.buckets || []).find((b) => b.bucketName === bucketName);
        if (found) bucketId = found.bucketId;
      }
    }

    if (!bucketId) return [];

    const res = await fetch(`${auth.apiUrl}/b2api/v2/b2_list_file_names`, {
      method: 'POST',
      headers: {
        Authorization: auth.authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId,
        prefix,
        maxFileCount: 1000,
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    return (data.files || []).map((f) => ({
      fileName: f.fileName,
      fileId: f.fileId,
      uploadTimestamp: f.uploadTimestamp,
      contentLength: f.contentLength,
      downloadUrl: `${auth.downloadUrl}/file/${bucketName}/${f.fileName}`,
    }));
  } catch (err) {
    console.warn('Error listing Backblaze B2 files:', err.message);
    return [];
  }
}

async function deleteBackblazeFile(fileName, fileId) {
  const auth = await getB2Auth();
  if (!auth) return false;

  try {
    let targetFileId = fileId;
    if (!targetFileId) {
      const files = await listBackblazeFiles(fileName);
      const found = files.find((f) => f.fileName === fileName);
      if (found) targetFileId = found.fileId;
    }

    if (!targetFileId) return false;

    const res = await fetch(`${auth.apiUrl}/b2api/v2/b2_delete_file_version`, {
      method: 'POST',
      headers: {
        Authorization: auth.authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileId: targetFileId,
      }),
    });

    return res.ok;
  } catch (err) {
    console.warn('Error deleting Backblaze B2 file:', err.message);
    return false;
  }
}

async function downloadBackblazeFile(fileName) {
  const auth = await getB2Auth();
  const bucketName = process.env.B2_BUCKET_NAME || auth?.bucketName;
  if (!auth || !bucketName) return null;

  try {
    const url = `${auth.downloadUrl}/file/${bucketName}/${fileName}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.text();
    }
    return null;
  } catch (err) {
    console.warn('Error downloading Backblaze B2 file:', err.message);
    return null;
  }
}

module.exports = {
  getB2Auth,
  uploadToBackblazeB2,
  uploadBase64ToB2,
  uploadAllBase64InHtml,
  uploadRemoteUrlToB2,
  listBackblazeFiles,
  deleteBackblazeFile,
  downloadBackblazeFile,
};

