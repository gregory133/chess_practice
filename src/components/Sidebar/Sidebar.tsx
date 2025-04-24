import { useState, ReactElement, useEffect } from 'react'
import InfoIcon from '@mui/icons-material/Info';
import styles from './Sidebar.module.scss'

import { Dictionary } from 'typescript-collections'

import SettingsIcon from '@mui/icons-material/Settings';
import InfoLayout from './InfoLayout/InfoLayout';
import DatabaseLayout from './DatabaseLayout/DatabaseLayout';
import SettingsLayout from './SettingsLayout/SettingsLayout';
import { MenuBook } from '@mui/icons-material';
import { HIGHTLIGHTED_COLOR, HOVERED_COLOR, UNHIGHLIGHTED_COLOR } from '../../classes/Constants';

interface TopBarOption{
  name:string,
  icon: ReactElement<any, any>
}

export default function Sidebar() {

 
  const [selectedTopbarIcon, setSelectedTopbarIcon] = useState<string>('Database')
  const [topBarButtonsHoverState, setTopBarButtonsHoverState] = useState<boolean[]>([false, false, false])

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

  function onClickTopbarOption(option:string){
    setSelectedTopbarIcon(option)
  }

  function onMouseEnterTopBarButton(key:number){
    let newTopBarButtonsHoverState = topBarButtonsHoverState
    newTopBarButtonsHoverState[key] = true
    setTopBarButtonsHoverState([...newTopBarButtonsHoverState])
  }

  function onMouseLeaveTopBarButton(key:number){
    let newTopBarButtonsHoverState = topBarButtonsHoverState
    newTopBarButtonsHoverState[key] = false
    setTopBarButtonsHoverState([...newTopBarButtonsHoverState])
  }

  return (

    <div className={styles.main}>
        <div className={styles.topOptions} >
          {
            topBarOptions.map((option, key)=>{

              let backgroundColor = UNHIGHLIGHTED_COLOR

              if (option.name == selectedTopbarIcon){
                backgroundColor = HIGHTLIGHTED_COLOR
              }
              else if (topBarButtonsHoverState[key]){
                backgroundColor = HOVERED_COLOR
              }


              return (
                <div className={styles.topOptionButton} key={key} 
                
                onMouseEnter={()=>onMouseEnterTopBarButton(key)}            
                onMouseLeave={()=>onMouseLeaveTopBarButton(key)}

                onClick={()=>onClickTopbarOption(option.name)}
                 style={{backgroundColor: backgroundColor}}>
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
