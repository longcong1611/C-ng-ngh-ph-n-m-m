const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const moment = require('moment-timezone');
const collection = require("../common/mongoose");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false})); 



 app.get("/", (req,res) => {
    res.render("login");
});

app.get("/home", (req,res) => {
    res.render("home");
});

app.get("/trip", (req,res) => {
    res.render("trip");
});

app.get("/blog", (req,res) => {
    res.render("blog");
});

app.get("/services", (req,res) => {
    res.render("services");
});

app.get("/about", (req,res) => {
    res.render("about");
});



app.post("/register", async (req, res) => {
   const { Username, Email, Password } = req.body; 

     if (!Username || !Email || !Password) {
        return res.status(400).send("Vui lòng cung cấp đầy đủ thông tin.");
        
    }  

    // Kiểm tra xem tài khoản đã tồn tại chưa
    const existingUser = await collection.findOne({ Username: Username });

    if (existingUser) {
        return res.send("Tài khoản đã tồn tại. Vui lòng chọn cái khác.");
    } else {
        const saltRound = 10;  // số lượng rounds cho mã hóa
        const hashedPassword = await bcrypt.hash(Password, saltRound);

        // Tạo một đối tượng mới chứa thông tin người dùng
        const newUser = {
            Username: Username,
            Email: Email,
            Password: hashedPassword,
        };

        // Thêm người dùng mới vào cơ sở dữ liệu
        try {
            const userData = await collection.create(newUser);
            console.log(userData);
            res.render("login");
        } catch (error) {
            console.error("Lỗi khi thêm người dùng vào cơ sở dữ liệu:", error);
            res.status(500).send("Đã xảy ra lỗi khi tạo tài khoản.");
        }
    }
});


app.post("/login",async (req,res) => {
    try{
        const check = await collection.findOne({Email: req.body.Email});

        if(!check){
            res.send("Email không tìm thấy");
        }//'Asia/Ho_Chi_Minh'

        if (!check.Password) {
            res.send("Mật khẩu không tồn tại");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.Password, check.Password);
        if(isPasswordMatch){
            const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate();
            await collection.updateOne({ _id: check.o_id }, { $push: { logins: vietnamTime }});
            res.render("home");
        }
        else{
            res.send("sai mật khẩu");
        }
    }
    catch (error) {
        console.error("Lỗi khi kiểm tra tài khoản:", error);
        res.send("Có lỗi xảy ra khi đăng nhập.");
    }
}); 


app.post("/search", async (req, res) => {
    try{
        const check = await collection.findOne({Destination: req.body.Destination});

        if(!check){
            res.status(404).send("Không có chuyến đi như vậy");
            return;
        }

        if(!check.Time){
            res.status(400).send("chuyến đi không vào thời gian này");
            return;
        }
        else{
            res.render("trip.ejs" , {tripData: tripData});
        }
    }

    catch(error){
        console.error("Thông tin tìm kiếm không chính xác", error);
        res.status(500).send("Có lỗi xảy ra khi tìm kiếm");
    }
});


app.post("/create", async (req, res) => {
    const{Destination, Time, Description, Contact} = req.body;
 
    if(!Destination || !Time || !Description || !Contact){
     return res.status(400).send("Vui lòng cung cấp đầy đủ thông tin.")
    }
 
    const newTrip = {
     Destination: Destination,
     Time: Time,
     Description: Description,
     Contact: Contact,
    };
 
    try{
     const tripData = await collection.create(newTrip);
     console.log("Chuyến đi mới đã được tạo:", tripData);
     res.render("trip.ejs", {tripData: tripData});
    } catch (error){
         console.error("Lỗi khi thêm người dùng vào cơ sở dữ liệu:", error);
         res.status(500).send("Đã xảy ra lỗi khi tạo chuyến đi.");
     }
 }); 


module.exports = app; 