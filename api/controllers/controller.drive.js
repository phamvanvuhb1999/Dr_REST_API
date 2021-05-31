//google drive storage

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);


oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

module.exports.uploadFile = async function uploadFile(filePath) {
    try {
        let filename = filePath.split('\\');
        filename = filename[filename.length - 1];
        let extention = filename.split('.');
        extention = extention[extention.length - 1];

        const response = await drive.files.create({
            requestBody: {
                name: filename,
                mimeType: `image/${extention}`,
            },
            media: {
                mimeType: `image/${extention}`,
                body: fs.createReadStream(filePath)
            }
        })

        //{kink, id, name, mimetype}
        return response.data.id;
    } catch (err) {
        console.log(err);
    }
}

module.exports.deleteFile = async function deleteFile(fileId) {
    try {
        const response = await drive.files.delete({
            fileId: fileId
        });
        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
}

module.exports.generatePublicUrl = async function generatePublicUrl(fileId) {
    try {
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            }
        })

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });
        //{webviewlink, webcontentlink}
        return result.data.webViewLink;
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports.uploadAndGetLink = async function(path) {
    let id = await this.uploadFile(path);
    let url = await this.generatePublicUrl(id);
    return url;
}