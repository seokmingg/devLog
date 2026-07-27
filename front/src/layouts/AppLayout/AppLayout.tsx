import {Outlet} from 'react-router-dom'
import {BottomNav} from '../../components/layout/BottomNav'
import {Header} from '../../components/layout/Header'
import {Sidebar} from '../../components/layout/Sidebar'
import styles from './AppLayout.module.css'

/** 로그인처럼 독립된 화면을 제외한 서비스 공통 레이아웃입니다. */
export function AppLayout() {
    return (
        <div className={styles.shell}>
            <Sidebar/>
            <div className={styles.workspace}>
                <Header/>
                <Outlet/>
            </div>
            <BottomNav/>
        </div>
    )
}
