const exp = require('express');
const upload = require('express-fileupload');//sử dụng thư viện 'express-fileupload'

const app = exp();

app.use(upload());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/', (req, res) => {
    
    let file = req.files.fileUri;
    let fileSize = file.size;
    let fileName = file.name;

    if (fileSize >= (1 * 1024 * 1024)) {
        res.send("File vượt quá  1MB!");
        return;
    }


    file.mv('./uploads/' + fileName, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Upload thành công")
        }
    })

});

app.post('/multiple', (req, res) => {
    //console.log(req.files);
    if (req.files) {
        let data = req.files.fileMultiple;
        //console.log(Array.isArray(data));
        if (Array.isArray(data)) {

            let dataFile = [...data];
            let status = true;
            let size = 0;

            dataFile.forEach((value) => {
                if (value.mimetype == 'image/png' || value.mimetype == 'image/gif' || value.mimetype == 'image/jpeg') {
                    status = true;
                    size += value.size;
                } else {
                    status = false;
                }
            })

            if (status) {
                let xet = true;
                if (size >= (1 * 1024 * 1024)) {
                    res.send("Kích thước quá 1 MB !");
                } else {
                    dataFile.map(value => {
                        let setName = value.name.split(".");
                        setName.pop();
                        let newName = setName[0].concat('.jpg');
                        value.mv('./uploads/' + newName , (err) => {
                            if (err) {
                                xet = false;
                            }
                        });
                    })
                    if (xet) {
                        res.send("Thành công !");
                    } else {
                        res.send("Lỗi !!!!");
                    }
                }
            } else {
                res.send("Có file ko phải ảnh !");
            }
        } else {
            let obj = { ...data };
            //console.log(obj);
            if (obj.mimetype == 'image/png' || obj.mimetype == 'image/gif' || obj.mimetype == 'image/jpeg') {
                let setName = obj.name.split(".");
                setName.pop();
                let newFile = setName[0].concat('.jpg');
                let xet = true;
                obj.mv('./uploads/' + newFile, (err) => {
                    if (err) {
                        xet = false;
                    }
                });
                if (xet) {
                    res.send("Thành công !");
                } else {
                    res.send("Lỗi !");
                }
            } else {
                res.send("Đây ko phải file hình ảnh");
            }
        }
    }
});

app.listen(3000, () => {
    console.log("Server đang chạy 3000");
})
