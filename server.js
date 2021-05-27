const express=require('express');
const path =require('path');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const _=require('lodash');
const saltRounds=10;
//so here is the mongoose code-->
const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/registerDB",{useNewUrlParser: true, useUnifiedTopology: true});
const registerSchema =new mongoose.Schema({
    Privilege:String,
    fullname:String,
    email:String,
    password:String,
    moblie:String
});


const Register=mongoose.model('Register',registerSchema);

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.get('/',(req,res)=>{
    res.render('login');
});
app.get('/register/student',(req,res)=>{
    res.render('student');
});
app.post('/register/student',(req,res)=>{
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    let funame=req.body.fname+ " "+req.body.lname;
    let semail=req.body.email;
    let smobile=req.body.mobile;
    let spassword=hash;
    const student= new Register({
        Privilege:"Student",
        fullname:funame,
        email:semail,
        password:spassword,
        moblie:smobile
    });
    student.save((err,data)=>{
        if(err){
            console.log(err);
        }else{ 
            res.redirect('/register/student');
        }
    });
    });
    
});
app.post('/',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    Register.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err1, result) {
                    if(result===true){
                        if(foundUser.Privilege==='Student'){
                            res.redirect('/student/'+foundUser._id);
                        }else if(foundUser.Privilege==='Teacher'){
                            res.redirect('/teacher/'+foundUser._id);
                        }
                        
                    }else{
                        res.redirect('/');
                    }
                });
            }else{
                res.redirect('/');
            }
        }
    });
});
app.get('/logout/:id',(req,res)=>{
    res.redirect('/');
});
app.get('/logout/',(req,res)=>{
    res.redirect('/admin');
});
//student......------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/student/:id',(req,res)=>{
    const token=req.params.id;
    Register.findOne({_id:token},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('studentDashboard',{data:docs,token:token});
        }
    }).select("-password");
});
app.get('/student/:id/profile',(req,res)=>{
    const token=req.params.id;
    Register.findOne({_id:token},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('studentProfile',{data:docs,token:token});
        }
    }).select("-password");
});

app.get('/student/:id/updates',(req,res)=>{
    const token=req.params.id;
    Register.findOne({_id:token},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('studentsUpdates',{token:token});
        }
    }).select("-password");
});
app.get('/student/:id/fee',(req,res)=>{
    const token=req.params.id;
    Register.findOne({_id:token},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('studentFee',{token:token});
        }
    }).select("-password");
});
app.get('/student/:id/fee',(req,res)=>{
    const token=req.params.id;
    Register.findOne({_id:token},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('studentA',{token:token});
        }
    }).select("-password");
});
app.get('/student/:id/assingment',(req,res)=>{
    const token=req.params.id;
    Register.findOne({_id:token},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('studentA',{token:token});
        }
    }).select("-password");
});

//teacher.......------------------------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>
app.get('/teacher/:id',(req,res)=>{
    const das=req.params.id;
    Register.findOne({_id:das},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('teacherDashboard',{token:docs._id,para:'student'});
        }
    });
});
app.get('/teacher/:id/profile',(req,res)=>{
    const das=req.params.id;
    Register.findOne({_id:das},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('teacherProfile',{data:docs,token:das,para:'student'});
        }
    });
});
app.get('/teacher/:id/attendence',(req,res)=>{
    const das=req.params.id;
    Register.findOne({_id:das},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            Register.find({Privilege:'Student'},(er1,std)=>{
                if(er1){
                    console.log(er1);
                }else{
                     res.render('teacherAttendence',{atnd:std,token:das,para:'student'});
                }
            }).select("-password");
        }
    });
});
app.get('/teacher/:id/marks',(req,res)=>{
    const das=req.params.id;
    Register.findOne({_id:das},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            Register.find({Privilege:'Student'},(er1,std)=>{
                if(er1){
                    console.log(er1);
                }else{
                     res.render('teacherMarks',{mark:std,token:das,para:'student'});
                }
            }).select("-password");
        }
    });
});
app.get('/teacher/:id/updates',(req,res)=>{
    const das=req.params.id;
    Register.findOne({_id:das},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('teacherUpdates',{token:das,para:'student'});
        }
    });
});
app.get('/teacher/:id/assnotes',(req,res)=>{
    const das=req.params.id;
    Register.findOne({_id:das},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('teacherAssAndNotes',{token:das,para:'student'});
        }
    });
});

app.get('/register/teacher',(req,res)=>{
    res.render('teacher');
});
app.post('/register/teacher',(req,res)=>{
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    let funame=req.body.fname+ " "+req.body.lname;
    let temail=req.body.email;
    let tmobile=req.body.mobile;
    let tpassword=hash;
    const teacher= new Register({
        Privilege:"Teacher",
        fullname:funame,
        email:temail,
        password:tpassword,
        moblie:tmobile
    });
    teacher.save((err,data)=>{
        if(err){
            console.log(err);
        }else{ 
            res.redirect('/register/teacher');
        }
    });
    });
    
});
app.get('/teacher/:id/list/students/:n',(req,res)=>{
    let query="student"; 
    const id=req.params.id;
    let currentPage=Number(req.params.n);
    if(currentPage<=0){
        currentPage=1;
    }
    let perPage=10;
    query=_.capitalize(query); 
    Register.find(({Privilege:query}),(err,result)=>{
        res.render('studentList',{data:result,token:id,para:'student',page:currentPage});
    }).limit(10).skip((currentPage - 1) * perPage).select("-password");
});
app.get('/teacher/:id/search',(req,res)=>{
    const das=req.params.id
    res.render('searchStu',{data:[],token:das,para:'student'});
});
app.post('/teacher/:id/search',(req,res)=>{
    const name=req.body.search;
    const das=req.params.id;
    Register.find({ "fullname": {$regex:new RegExp(name, 'i')}}, function (err, docs) {
        if(err){
            console.log(err);
        }else{
            res.render('searchStu',{data:docs,token:das,para:'student'});
        }
    }).select("-password");
});
app.get('/teacher/:tid/details/:id',(req,res)=>{
    const tid=req.params.tid;
    const id=req.params.id;
    Register.findOne({_id:tid},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            Register.findOne({_id:id},(err,docsS)=>{
                res.render('TstudentDetail',{data:docsS,token:tid});
            });
        }
    });
})


//admin......------------------------------------------------------------------------------->>>>>>>>>>>>>>

app.get('/admin/regadmin',(req,res)=>{
    res.render('adminReg');
});
app.post('/admin/regadmin',(req,res)=>{
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    let funame=req.body.fname+ " "+req.body.lname;
    let temail=req.body.email;
    let tmobile=req.body.mobile;
    let tpassword=hash;
    const teacher= new Register({
        Privilege:"Admin",
        fullname:funame,
        email:temail,
        password:tpassword,
        moblie:tmobile
    });
    teacher.save((err,data)=>{
        if(err){
            console.log(err);
        }else{ 
            res.redirect('/admin/regadmin');
        }
    });
    });
    
});
app.get('/admin',(req,res)=>{
    res.render('adminlogin');
});
app.get('/admin/logout',(req,res)=>{
    res.redirect('/admin');
});
app.post('/admin',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    Register.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.Privilege==='Admin'){
                    bcrypt.compare(password, foundUser.password, function(err1, result) {
                        console.log("inn");
                        if(result===true){
                            console.log("log in");
                            res.redirect('/admin/panel');
                        }else{
                            res.redirect('/admin');
                        }
                    });
                }
             }else{
                res.redirect('/admin');
            }
        }
    });
});
app.get('/admin/panel',(req,res)=>{
    res.render('adminpanel');
});
app.get('/admin/list',(req,res)=>{
    res.render('list',{data:null,para:null});
});
app.post('/admin/list/:token',(req,res)=>{
    const tokenD=req.params.token;
    let id=tokenD.split(":");
    Register.findByIdAndRemove(id[1],function(err){
        if(err){
            console.log(err);
        }else{
            console.log("successsfully deleted");
        }
    });
    console.log(id);
    
    res.redirect('/admin/list');
});
app.get('/admin/list/:ctg/:n',(req,res)=>{
    let query=req.params.ctg; 
    let currentPage=Number(req.params.n);
    if(currentPage<=0){
        currentPage=1;
    }
    let perPage=10;
    query=_.capitalize(query); 
    Register.find(({Privilege:query}),(err,result)=>{
        res.render('list',{data:result,para:req.params.ctg,page:currentPage});
    }).limit(10).skip((currentPage - 1) * perPage).select("-password");
});
app.get('/admin/edit/:id',(req,res)=>{
    res.render('adminedit',{id:req.params.id});
});
app.post('/admin/edit/:id',(req,res)=>{
    
    const cfullname=req.body.fname+" "+req.body.lname;
        const cmobile=req.body.mobile;
        const cemail=req.body.email;
        let cpassword="";
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        
        Register.findOneAndUpdate({_id:req.params.id},{fullname:cfullname,
            email:cemail,
            password:hash,
            moblie:cmobile},{upsert: true}, function(err, doc) {
                if (err) {console.log(err);}else{
                    console.log("success");
                }
            });
    });
    
    res.redirect('/admin/list');
});
app.get('/admin/search',(req,res)=>{
    res.render('search',{data:[]});
});
app.post('/admin/search',(req,res)=>{
    const name=req.body.search;
    Register.find({ "fullname": {$regex:new RegExp(name, 'i')}}, function (err, docs) {
        if(err){
            console.log(err);
        }else{
            res.render('search',{data:docs});
        }
    }).select("-password");
});
app.get('/admin/details/:id',(req,res)=>{
    const id=req.params.id;
    Register.find({_id:id},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('AdminCheck',{data:docs});
        }
    }).select("-password");
});
app.listen(3001,()=>{
    console.log("server is started");
});