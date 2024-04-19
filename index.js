const express = require('express');
const app = express();
const fs = require('fs');

// Middleware để parse JSON body
app.use(express.json());

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
        const provinces = await readJsonFile('provinces');
        res.json(provinces);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Endpoint cho huyện
app.get('/districts', async (req, res) => {
    try {
        const districts = await readJsonFile('districts');
        res.json(districts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Endpoint cho xã
app.get('/wards', async (req, res) => {
    try {
        const wards = await readJsonFile('wards');
        res.json(wards);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000; // Sử dụng cổng 3000 hoặc cổng khác tùy ý bạn chọn
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
