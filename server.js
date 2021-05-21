//Authentication 인증 
//Authorization 허가
// REST API : f5a600f54f327fe75f720881572afb77
// Redirect URI : http://localhost:8000/auth/kakao/callback
// Key : P7GAyuIufPnwOFUAPkQ99O9Db8xepm4v


const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const axios = require('axios')
const qs = require('qs')
const session = require('express-session');

app.use(session({
    secret:'aa',//아무내용
    resave:true,
    secure:false,
    saveUninitialized:false,
}))

nunjucks.configure('views', {
    express: app,
})
app.set('view engine', 'html')

const kakao = {
    clientID: 'f5a600f54f327fe75f720881572afb77',
    clientSecret: 'P7GAyuIufPnwOFUAPkQ99O9Db8xepm4v',
    redirectUri: 'http://localhost:3000/auth/kakao/callback'
}

app.get('/', (req, res) => {
    res.render('index.html');
})

app.get('/auth/kakao', (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile,account_email`;
    res.redirect(kakaoAuthURL);
});

// app.get('/auth/kakao/callback',async (req,res)=>{
//     token = await axios({
//         method:'POST',
//         url:'https://kauth.kakao.com/oauth/token',
//         headers:{
//             "content-type":'application/x-www-form-urlencoded',
//         }
//     })
//     console.log(token)
//     res.send('ok');
// })
app.get('/auth/kakao/callback', async (req, res) => {
    let token;
    try {
        token = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                grant_type: 'authorization_code',
                // 특정 string 넣기 
                client_id: kakao.clientID,
                client_secret: kakao.clientSecret,
                redirectUri: kakao.redirectUri,
                code: req.query.code,
                //auth/kakao/callback일때 get값으로 준 코드야
            })
            //객체를 string으로 변환 
        })
    } catch (err) {
        res.json(err.data)
    }


//kakao에게 요청 / 
    let user;
    try{
        user = await axios({
            method:"GET",
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization:`Bearer ${token.data.access_token}`
            }
        })
    }catch(err){
        res.json(err.data)
    }
    console.log(user);

    req.session.kakao = user.data

    // req.session = {
    //     ['kakao'] : user.data,
    // }

    res.redirect('/');
});

app.get('/auth/info',(req,res)=>{
    let {nickname,profile_image} = req.session.kakao.properties
    res.render('info.html',{
        nickname,profile_image
    });
})


app.listen(3000, () => {
    console.log(`server start port : 3000`)
})


