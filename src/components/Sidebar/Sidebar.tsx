import React, { useState, useEffect, useRef, ReactElement } from 'react'
import InfoIcon from '@mui/icons-material/Info';
import styles from './Sidebar.module.scss'

import { Dictionary } from 'typescript-collections'

import { useMediaQuery } from 'react-responsive'
import SettingsIcon from '@mui/icons-material/Settings';
import InfoLayout from './InfoLayout/InfoLayout';
import DatabaseLayout from './DatabaseLayout/DatabaseLayout';
import SettingsLayout from './SettingsLayout/SettingsLayout';
import { MenuBook } from '@mui/icons-material';

interface TopBarOption{
  name:string,
  icon: ReactElement<any, any>
}

export default function Sidebar() {

  const [selectedTopbarIcon, setSelectedTopbarIcon] = useState<string>('Database')
  
  const isLandscape = useMediaQuery({
    query : '(min-aspect-ratio: 4/5)'
  })

  const topBarOptionsSx = {margin: '0 0.5rem 0 0', width: '2.5rem', height: '2.5rem'}

  const topBarOptions : TopBarOption[] = [
    {
      name: 'Info',
      icon: <InfoIcon sx={topBarOptionsSx}/>
    },
    {
      name: 'Database',
      icon: <MenuBook sx={topBarOptionsSx}/>
    },
    {
      name: 'Settings',
      icon: <SettingsIcon sx={topBarOptionsSx}/>
    }

  ]

  const contentLayoutDict = new Dictionary<string, ReactElement>();{
    contentLayoutDict.setValue('Info', <InfoLayout/>)
    contentLayoutDict.setValue('Database', <DatabaseLayout/>)
    contentLayoutDict.setValue('Settings', <SettingsLayout/>)
  }

  
  return (

    <div className={styles.main}>
        <div className={styles.topOptions}>
          {
            topBarOptions.map((option, key)=>{
              let backgroundColor = '#26231e'
              if (option.name == selectedTopbarIcon){
                backgroundColor = '#545454'
              }
              return (
                <div key={key} className={styles.topOptionButton}
                 style={{backgroundColor: backgroundColor}} >
                  {option.icon}
                  {option.name}
                </div>
              )
            })
          }        
        </div>
        <div className={styles.content}>
          {
            contentLayoutDict.getValue(selectedTopbarIcon)
          }
        </div>
    </div>
  )
}
