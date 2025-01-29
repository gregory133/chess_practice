import React from 'react'
import styles from './Navbar.module.scss'
import GitHubIcon from '@mui/icons-material/GitHub';
import { useMediaQuery } from '@mui/material';
import OpeningsSeachBar from '../OpeningsSearchBar/OpeningsSeachBar';

interface Props{
    mainStyles? : React.CSSProperties
}

export default function Navbar(props:Props) {

    const isSmallWidth = useMediaQuery('(min-width: 400px)')

    return (
        <div style={props.mainStyles} className={styles.main}>
            <div className={styles.content}>

                <div className={styles.logo}>
                    <div className={styles.logoImage} style={{backgroundImage: 
                        `url('${process.env.PUBLIC_URL}/images/white.png')`}}/>
                    <span>Chess Opening Practice</span>
                </div>

                

                <div className={styles.credits}>
                    
                    <div className={styles.githubLogoContainer}>
                        <a target='_blank' href='https://github.com/gregory133/chess_practice'>
                            <GitHubIcon sx={{
                                height: '3rem',
                                width: '3rem',
                                color: 'white'
                            }}/>
                        </a>
                    </div>
                    
                    {
                        isSmallWidth ? <span>Made by Gregory Marcelin</span> : null
                    } 
                    <OpeningsSeachBar/> 
                </div>

            </div>
            <div className={styles.thinLine}/>
        </div>
        
    )
}
