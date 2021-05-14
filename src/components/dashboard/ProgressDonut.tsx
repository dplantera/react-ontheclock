/**https://codepen.io/egorava/pen/wGmmJW
 */
import "./Dashboard.css"
import {useEffect, useRef, useState} from "react";


export default function ProgressDonut(props: any) {
    const [progress, setProgress] = useState(64)
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current) return;

        const can = canvas.current,
            ctx = can.getContext('2d');
        const lineWidth = 20;
        const radius = 50;

        let posX = can.width / 2,
            posY = can.height / 2,
            fps = 1000 / 200,
            procent = 0,
            oneProcent = 360 / 100,
            result = oneProcent * progress;

        if (!ctx) return;
        ctx.lineCap = 'round';
        startProgress();

        function startProgress() {
            let deegres = 0;
            let acrInterval = setInterval(function () {
                deegres += 1;
                if(!ctx) return;
                ctx.clearRect(0, 0, can.width, can.height);
                procent = deegres / oneProcent;

                /*https://www.quora.com/Why-do-we-divide-pi-by-180-when-we-convert-it-to-a-degree
                * 360(degrees)=2∗pi(radians)
                , => 180(degrees)=pi(radians)
                * => 1(degree)=pi/180(radians)
                * */
                let oneDegree = Math.PI / 180;
                const startAngle = oneDegree * 270;
                ctx.beginPath();
                ctx.arc(posX, posY, radius, startAngle, oneDegree * (270 + 360));
                // ctx.arc(posX, posY, radius, 270, 270);
                ctx.strokeStyle = 'rgba(245,21,66,0.6)';
                ctx.lineWidth = lineWidth;
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'rgb(68,171,57)';
                ctx.lineWidth = lineWidth;
                ctx.arc(posX, posY, radius, startAngle, oneDegree * (270 + deegres));
                // ctx.arc(posX, posY, radius, 270, 270);
                ctx.stroke();
                if (deegres >= result) clearInterval(acrInterval);
            }, fps);

        }
    }, [canvas])
    return (
            <canvas ref={canvas} id={"progress-donut"} className={"progress-donut"}></canvas>
    );
}