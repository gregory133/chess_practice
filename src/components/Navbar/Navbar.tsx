import React from 'react'
import styles from './Navbar.module.scss'
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Navbar() {

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <div className={styles.logo}>
                    <div className={styles.image} style={{backgroundImage: `url('${process.env.PUBLIC_URL}/images/white.png')`}}/>
                    <div>Chess Opening Practice</div>
                </div>
                <div className={styles.credits}>
                    <span>Made by Gregory Marcelin</span>
                    <div className={styles.githubLogoContainer}>
                        <a target='_blank' href='https://github.com/gregory133/chess_practice'>
                            <GitHubIcon sx={{
                                height: '3rem',
                                width: '3rem',
                                color: 'white'
                            }}/>
                        </a>
                    </div>
                    
                    
                </div>
                
            </div>
            <div className={styles.thinLine}/>
        </div>
        
    )
}
