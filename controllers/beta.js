import { v4 as uuidv4 } from 'uuid';
import { bigqueryClient } from '../index.js';

export const betaAll = async (req, res) => {
    const {id} = req.query
    if (id === undefined) {
        return res.status(400).json({
            error: true,
            message: "Gagal mengambil beta user. Mohon isi data dengan benar"
        });
    }
    const queryBetaExist = `SELECT * FROM \`dangerdetection.dantion_big_query.betaRequest\` WHERE id=@id`;
    let options = {
        query: queryBetaExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [BetaExist] = await bigqueryClient.query(options);
    if (BetaExist.length === 0){
        return res.status(400).json({
            error: true,
            message: "Gagal melihat beta user, Anda tidak berhak",
        });
    }

    const queryBetaAll = `SELECT * FROM \`dangerdetection.dantion_big_query.betaRequest\``;
    options = {
        query: queryBetaAll,
        location: 'asia-southeast2'
    };
    const [beta] = await bigqueryClient.query(options);

    return res.json({
        error: false,
        message: "Berhasil Mendapatkan Semua Beta User",
        beta
    });
}

export const betaForm = async (req, res) => {
    const {
        name, email, city,
    } = req.body;
    
    if (name === undefined || email === undefined || city === undefined) {
        return res.status(400).json({
            error: true,
            message: "Gagal menambahkan beta user. Mohon isi data dengan benar"
        });
    }

    // const queryUserExist = `SELECT COUNT(email) AS emailCount FROM \`dangerdetection.dantion_big_query.betaRequest\` WHERE email=@email`;
    // let options = {
    //     query: queryUserExist,
    //     location: 'asia-southeast2',
    //     params: { email: email }
    // };
    // const [userExist] = await bigqueryClient.query(options);

    // if(userExist[0].emailCount !== 0) {
    //     return res.status(400).json({
    //         error: true,
    //         message: "Gagal menambahkan user. Email sudah terdaftar"
    //     });
    // }

    const id = `BR-${uuidv4()}`;
    const isSent = false;

    const queryNewBeta = `INSERT \`dangerdetection.dantion_big_query.betaRequest\`
    (id, name, email, city, isSent) 
    VALUES (@id, @name, @email, @city, @isSent)`;

    options = {
        query: queryNewBeta,
        location: 'asia-southeast2',
        params: {
            id: id, 
            name: name, 
            email: email,
            city: city,
            isSent: isSent
        }
    };

    await bigqueryClient.query(options);

    return res.json({
        error: false,
        message: "Beta user berhasil ditambahkan"
    });
}

export const betaDetail = async (req, res) => {
    const { id } = req.params

    const queryBetaExist = `SELECT * FROM \`dangerdetection.dantion_big_query.betaRequest\` WHERE id=@id`;
    let options = {
        query: queryBetaExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [rBetaExist] = await bigqueryClient.query(options);

    if(rBetaExist.length !== 0) {
        const betaExist = rBetaExist[0];
        console.log(betaExist);
        return res.json({
            error: false,
            message: "Berhasil mendapatakan detail beta user",
            beta: {
                id: betaExist.id,
                name: betaExist.name,
                email: betaExist.email,
                city: betaExist.city,
                isSent: betaExist.isSent,
            },
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Beta user tidak ditemukan"
        });
    }
}