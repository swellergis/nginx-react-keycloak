import express, { Router } from "express";
import cors from 'cors';

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const users = [
    {
        '_id': 1,
        'name': 'Ritwik Math'
    },{
        '_id': 2,
        'name': 'John Doe'
    },{
        '_id': 3,
        'name': 'Jane Doe'
    }
]

const apikey = '4236dgfhg'
const contactemail = 'lumenuser@lumen.com'
const version = '1.0.0';

const promiseUsers = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(users)
    }, 3000)
})
const promiseVersion= new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(version)
    }, 3000)
})
const promiseApiKey = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(apikey)
    }, 3000)
})
const promiseContactEmail = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(contactemail)
    }, 3000)
})
const promiseHealthCheck = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('aok')
    }, 3000)
})

const route = Router();

// health-check
route.get('/', async (req, res, next) => {
    try {
        const data = await promiseHealthCheck;
        return res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error.message)
    }
});

route.get('/v3/version_number', async (req, res, next) => {
    try {
        const data = await promiseVersion;
        return res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error.message)
    }
});

route.get('/globalpreferences', async (req, res, next) => {
    console.log("hello " + req.query.name)
    try {
        const data = await promiseContactEmail;
        return res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error.message)
    }
});

route.get('/apikeys', async (req, res, next) => {
    console.log("hello " + req.query.name)
    try {
        const data = await promiseApiKey;
        return res.status(200).json({
            'message': 'Fetched successfully',
            'apikey': data
        })
    } catch (error) {
        console.log(error.message)
    }
});

route.get('/users', async (req, res, next) => {
    try {
        // console.log(JSON.stringify(req.headers));
        // console.log(JSON.stringify(req.header('access-token')));

        const data = await promiseUsers;
        return res.status(200).json({
            'message': 'Fetched successfully',
            'users': data
        })
    } catch (error) {
        console.log(error.message)
    }
});

app.use(route);

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})
