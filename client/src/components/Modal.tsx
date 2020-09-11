import React from 'react'
import styles from './Modal.module.css'

type ModalType = {
    text: string
    buttonAcceptText: string,
    cancel: any,
    accept: any,
}

export default ({text, buttonAcceptText, cancel, accept}: ModalType) => {
    return(
        <div className={styles.modalLayer}>
            <div className={styles.modal}>
                <div className={styles.text}>{text}</div>
                <div className={styles.buttonGroup}>
                    <button className={styles.cancel} onClick={() => cancel(false)}>Отменить</button>
                    <button className={styles.accept} onClick={accept}>{buttonAcceptText}</button>
                </div>
            </div>
        </div>
    )
}