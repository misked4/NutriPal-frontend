import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material';
import { changeHeightToPercentage } from '../../Common';
import './Home.css';

export const Home = () => {
    useEffect(()=>{
        changeHeightToPercentage();
    },[]);

  return (
    <Box flex={4} p={2}>
      <div className="classBody">
        <div className="container">
            <div className="section">
            <div className="welcome-img">
            </div>
            <div className="welcome-title">
                <span className="title">Dobrodošli na Nutrpal!</span>
                <span className="description">Ne zaboravi da proveriš najnovije recepte za zdravu ishranu koje su postavili naši korisnici!</span>
            </div>
        </div>
        <div className="presentation-cards">
            <div className="card-one">
                <i className="fa-solid fa-list"></i>
                <div className="card-title">
                    <span>
                        Nedeljni plan ishrane
                    </span>
                </div>
                
                <div className="card-text">
                    <span>
                    Pregledaj svoj nedeljni plan ishrane koji je kreirao tvoj odabrani nutricionista
                </span>
                </div>
            </div>
            <div className="card-two">
                <i className="fa-solid fa-book"></i>
                <div className="card-title">
                    <span>
                        Recepti naših nutricionista
                    </span>
                </div>
                
                <div className="card-text">
                    <span>
                    Pregledaj recepte koje naši nutricionisti redovno ažuriraju, izmeni broj porcija kako bi dobio adekvatnu meru.
                </span>
                </div>
            </div>
            <div className="card-three">
                <i className="fa-solid fa-heart"></i>
                <div className="card-title">
                    <span>
                        Iskaži svoje mišljenje
                    </span>
                </div>
                
                <div className="card-text">
                    <span>
                    Lajkuj recepte koji su ti se dopali, kako bi pomogao drugim korisnicima da se odluče
                </span>
                </div>
            </div>
        </div>
        <div className="nutri-steps-title">
            <span>Kako do savršenog izgleda</span>
        </div>
        <div className="nutri-steps">
            
            <div className="step-one">
                <div className="image-container-home">
                    <div className="num-one">1</div>
                <div className="step-one-img"></div>
                </div>
                
                <div className="step-title">
                    <span>Zdrava ishrana</span>
                </div>
                <div className="step-text">
                    <span>Prva i osnovna stvar kako biste pre svega vodili zdrav život je korigovanje vaše ishrane.Čarobni napitak ne postoji, regulisanje ishrane na dugoročnoj osnovi je neophodno, kao i umerena fizička aktivnost.</span>
                </div>
            </div>
                <div className="step-two">
                    <div className="image-container-home">
                        <div className="num-two">2</div>
                    <div className="step-two-img"></div>
                    </div>
                <div className="step-title">
                    <span>Vežbe</span>
                </div>
                <div className="step-text">
                    <span>Stvaranje mišića je neophodno za gubitak težine, jer kada gradite mišiće, metabolizam se automatski ubrzava. Vežbanjem sagorevate više masnih naslaga i kalorija. Praktikujte vežbe snage najmanje tri puta nedeljno.</span>
                </div>
                </div>
                <div className="step-three">
                    <div className="image-container-home">
                        <div className="num-three">3</div>
                    <div className="step-three-img"></div>
                    </div>
                <div className="step-title">
                    <span>Pijte dosta vode</span>
                </div>
                <div className="step-text">
                    <span>Hidratacija je veoma važna, a naročito kada pokušavate da izgubite na težini. Hrana sa visokim sadržajem natrijuma uzrokuje zadržavanje tečnosti u organizmu, koju možete da izbacite iz organizma unosom veće količine vode.</span>
                </div>
                </div>
            </div>
            <section>
            <div className="prefooter prefooter-solid">
                <div className="title-wrapper">
                    <h1 className="homeh1">Uživaj u aplikaciji</h1>
                </div>
            </div>
            <div className="prefooter prefooter-image">
                <div className="title-wrapper">
                    <h1 className="homeh1">Uživaj u aplikaciji</h1>
                </div>
            </div>
            </section>
            <div className="footer">
                <div className="footer-title">
                    <span>Potrebna ti je pomoć?</span>
                </div>
                <div className="footer-text">
                    <span className="contact-info">Obrati se putem mail-a:</span>
                    <span className="contact-mail"><a href="mailto:milosdinic44@gmail.com">milosdinic44@gmail.com</a></span>
                </div>
                <div className="social">
                    <div className="instagram">
                        <i className="fa-brands fa-instagram"></i><span>nutripal</span>
                    </div>
                    <div className="facebook">
                        <i className="fa-brands fa-facebook"></i><span>nutripal</span>
                    </div>
                </div>
                
            </div>
        </div>
      </div>
    </Box>
  )
}
