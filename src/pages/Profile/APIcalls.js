import axios from 'axios'

export const getAllDiets = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API}/diets`)
    //console.log(response.data);
    return response.data;
}

export const uloadPhotoIfWeAlreadyDontHave = async (jsonObj) => {
    const response = await axios.post(`${process.env.REACT_APP_API}/images/upload`, jsonObj)
    console.log(response.data);
    return response;
}

export const updateUserAndHisAdditionalInfo = async (info) => {
    const userBaseInfo = {
        Ime: info.Ime,
        Prezime: info.Prezime,
        Lozinka: info.Lozinka,
        Datum_rodjenja: info.Datum_rodjenja,
        Uloga: info.Uloga,
        Telefon: info.Telefon,
        Adresa: info.Adresa,
        Slika: info.Slika,
        Pol: info.Pol,
        Cloudinary_public_id: info.Cloudinary_public_id
    }
    console.log(userBaseInfo);
    const response = await axios.put(`${process.env.REACT_APP_API}/user/${info.id}`, userBaseInfo)
    console.log(response.data);
    if(info.Dodatne_info_Id !== null)
    {
        const userAddInfo = {
            Visina: info.Visina,
            Tezina: info.Tezina,
            PotrosnjaKalorija: info.PotrosnjaKalorija,
            DijetaId: info.DijetaId,
            Cilj_ishrane: info.Cilj_ishrane,
            /*BMR: info.BMR,
            TEE: info.TEE,
            BMI: info.BMI*/
        }
        console.log(userAddInfo);
        const response = await axios.put(`${process.env.REACT_APP_API}/patient/${info.Dodatne_info_Id}`, userAddInfo)
        console.log(response.data);
    }

    return response;
}