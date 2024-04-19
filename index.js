const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors'); // Import thư viện cors

// Middleware để parse JSON body
app.use(express.json());

// Sử dụng cors middleware
app.use(cors());

// Cache để lưu trữ dữ liệu từ tệp JSON
let provinceCache = null;
let districtCache = null;
let wardCache = null;

const readJsonFile = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`data/${fileName}.json`, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    });
};

// Endpoint cho tỉnh
app.get('/provinces', async (req, res) => {
    try {
        if (!provinceCache) {
            provinceCache = await readJsonFile('provinces');
        }
        res.json(provinceCache);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Endpoint cho huyện
app.get('/districts/:provinceCode', async (req, res) => {
    try {
        const provinceCode = req.params.provinceCode;
        if (!districtCache) {
            districtCache = await readJsonFile('districts');
        }
        const districts = districtCache.filter(district => district.provinceCode === provinceCode);
        res.json(districts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Endpoint cho xã
app.get('/commune/:provinceCode/:districtCode', async (req, res) => {
    try {
        const { provinceCode, districtCode } = req.params;
        if (!wardCache) {
            wardCache = await readJsonFile('wards');
        }
        const wards = wardCache.filter(ward => ward.provinceCode === provinceCode && ward.districtCode === districtCode);
        res.json(wards);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000; // Sử dụng cổng môi trường hoặc cổng 3000 nếu không có
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
