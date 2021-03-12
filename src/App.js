import React, { useState } from 'react';
import './App.css';

const App = () => {
    const [displayTime, setDisplayTime] = useState(25 * 60);
    const [breakTime, setBreakTime] = useState(5 * 60);
    const [sessionTime, setSessionTime] = useState(25 * 60);
    const [timerOn, setTimerOn] = useState(false);
    const [onBreak, setOnBreak] = useState(false);
    const [breakAudio, setBreakAudio] = useState(new Audio("./breakAudio.mp3"));

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        return (minutes < 10 ? "0" + minutes: minutes) + 
        ":" +
        (seconds < 10 ? "0" + seconds: seconds)
    };

    const changeTime = (amount, type) => {
        if (type === 'break') {
            if (breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime(prev => prev + amount);
        } else {
            if (sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime((prev) => prev + amount);
            if (!timerOn) {
                setDisplayTime(sessionTime + amount)
            }
        }
    };

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if(!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if(prev <= 0 && !onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if (prev <= 0 && onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev - 1;
                    })
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval)
        }

        if (timerOn) {
            clearInterval(localStorage.getItem("interval-id"))
        }

        setTimerOn(!timerOn)
    };

    const resetTime = () => {
        setDisplayTime(25 * 60);
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
    };

    return (
        <div class="container" className="wrapper">
            <h1>25 + 5 Clock</h1>
            <div className="dual-container">
            <Length 
                title={"break length"} 
                changeTime={changeTime} 
                type={"break"} 
                time={breakTime} 
                formatTime={formatTime}
            />
            <Length 
                title={"session length"} 
                changeTime={changeTime} 
                type={"session"} 
                time={sessionTime} 
                formatTime={formatTime}
            />
            </div>
            <h1 class="timeDisplay">{formatTime(displayTime)}</h1>
            <button onClick={controlTime} type="button" class="btn btn-outline-danger">
                Play
            </button>
            <button onClick={resetTime} type="button" class="btn btn-outline-danger">
                Reset
            </button>
        </div>
    )
}

function Length({title, changeTime, type, time, formatTime}) {
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button value="-" onClick={() => changeTime(-60, type)}>
                    -
                </button>
                <h3>{formatTime(time)}</h3>
                <button value="+" onClick={() => changeTime(+60, type)}>
                    +
                </button>
            </div>
        </div>
    )
}

export default App;
