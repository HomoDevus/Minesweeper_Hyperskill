import React, {useContext} from 'react';
import logo from './img/logo.svg';
import './Minesweeper.css';
import Context from "./context";

function Timer(props) {
    // Transform Date to [min, sec] array
    let timeOutput = ['0' + props.control.timerCount.getMinutes(),
    '0' + props.control.timerCount.getSeconds()].map(component => component.slice(-2));

    return (
        <div>{timeOutput.join(':')}</div>
    )
}

function Reset(props) {
    const {reset} = useContext(Context)
    return (
        <button className={'reset-button'} onClick={reset}>{props.emoji}</button>
    )
}

function FlagsCounter(props) {
    return (
        <div>{props.control.flags}</div>
    )
}

function ControlPanel(props) {
    return (
        <div className={'cp-outer'}>
            <div className={'cp-heading'}>
                <h2>Minesweeper</h2>
                <img src={logo} className="cp-logo" alt="logo" />
            </div>
            <div className={'cp-control'}>
                <FlagsCounter control={props.control}/>
                <Reset emoji={props.control.resetEmoji}/>
                <Timer control={props.control} />
            </div>
        </div>
    )
}

function  Cell(cell) {
    const {openCell, flag} = useContext(Context)
    return (
        <div className={`cell ${cell.props.cellClass}`}
             onClick={() => openCell(cell.props)}
             onContextMenu={() => flag(cell.props)}>{cell.props.bombsAround}</div>
    )
}

function Field(props) {
    return (
        <div className={"field"}>
            {props.cells.map(cell => {
                return <Cell key={cell.id} props={cell} />
            })}
        </div>
    )
}

export default function Minesweeper(props) {
    return (
        <div className="game" onContextMenu={(e)=>  {e.preventDefault(); return false;}}>
            <ControlPanel control={props.control} />
            <Field cells={props.cells} />
        </div>
    );
}