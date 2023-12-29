import React, { useState } from 'react'
import Modal from 'react-modal';

import '../styles/Colors.scss'
import variables from '../styles/Variables.module.scss'
import style from '../styles/DatabaseSettingsModal.module.scss'
import { Database } from '../api/DBApi';
import { Dictionary } from 'typescript-collections';

interface Props{
  isOpen:boolean
	setIsOpen: (value:boolean)=>void
	
}

export default function DatabaseSettingsModal(props:Props) {
  const databases:Database[]=['masters', 'lichess', 'player']
  const dbIcons:Dictionary<Database, string>=new Dictionary()
  const databaseSettingsView:Dictionary<Database, JSX.Element>=new Dictionary()

  const defaultDatabase:Database='masters'
  const [selectedDatabase, setSelectedDatabase]=useState<Database>(defaultDatabase)

  loadDbIconsDict()
  loadDatabaseSettingsViewDictionary()

  function loadDbIconsDict(){
    dbIcons.setValue('lichess', '/images/lichess.png')
    dbIcons.setValue('masters', '/images/masters.png')
    dbIcons.setValue('player', '/images/user.png')
  }

  function loadDatabaseSettingsViewDictionary(){
    databaseSettingsView.setValue('masters', <div>masters</div>)
    databaseSettingsView.setValue('lichess', <div>lichess</div>)
    databaseSettingsView.setValue('player', <div>player</div>)
  } 

	/**
   * 
   * @returns an object encapsulating the initial style of the modal
   */
  function loadModalStyles():Modal.Styles{
    return {
      overlay: {
        zIndex: 1000
      },
      content: {
        backgroundColor: '#262421',
        width: '50%',
        height: '50%',
        top: '25%',
        left: '25%'
      }
    }
  }

  /**
   * called when the user clicks to select a database option
   * @param option 
   */
  function onClickDatabaseSelectOption(option:Database){
    setSelectedDatabase(option)
  }

	const databaseSettingsModalStyle=loadModalStyles()

  return (
    <Modal isOpen={props.isOpen} onRequestClose={()=>props.setIsOpen(false)} 
    style={databaseSettingsModalStyle}>
      <div className={style.content}>
        <div className={style.dbSelection}>
          {databases.map((database:Database, key:number)=>{
            const bgColor=database==selectedDatabase ? `${variables.sidebarBgLight}` : `${variables.sidebarBg}`
            console.log(bgColor)
            return(
              <div onClick={()=>onClickDatabaseSelectOption(database)} style={{backgroundColor: bgColor}} key={key}>{database}
                <img src={process.env.PUBLIC_URL+dbIcons.getValue(database)}/>
              </div>
            )
          })}
        </div>
        <div className={style.menuContent}>
          {databaseSettingsView.getValue(selectedDatabase)}
        </div>
      </div>
    </Modal>
  )
}
