import React from "react";
import { Button } from 'react-bootstrap'

function GameThumbnail({ players }) {
  const canvas = React.useRef();

  React.useEffect(() => {
    const context = canvas.current.getContext('2d');
    draw(context);
  });

  const roundedImage = (context, x, y, width, height, radius) => {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function boxShadow(ctx, image, shadowValues){

    const {box: {posX: x, posY: y, width: boxW, height: boxH}, offsetX, offsetY, blurRadius, spreadRadius, color} = shadowValues;
    
    // We draw the shadow
    ctx.save();
    const scaleFactor = 1;// ((2 * spreadRadius) + boxW) / boxW;
    // ctx.scale(scaleFactor, scaleFactor);
    ctx.shadowColor = color;
    ctx.shadowBlur = blurRadius;
    ctx.shadowOffsetX = offsetX + canvas.current.width;
    ctx.shadowOffsetY = offsetY + canvas.current.height;  
    ctx.fillStyle = '#2465D3'
    // console.log(scaleFactor, (x - spreadRadius - canvas.current.width) / scaleFactor, (y - spreadRadius - canvas.current.height) / scaleFactor)
    // ctx.fillRect((x - spreadRadius - canvas.current.width) / scaleFactor, (y - spreadRadius - canvas.current.height) / scaleFactor, boxW, boxH);
    // ctx.fillRect(-482, -482, boxW, boxH);
    roundedImage(ctx, (x - spreadRadius - canvas.current.width) / scaleFactor, (y - spreadRadius - canvas.current.height) / scaleFactor, boxW, boxH, 30);
    
    // roundedImage(ctx, (x - spreadRadius - canvas.current.width) / scaleFactor, (y - spreadRadius - canvas.current.height) / scaleFactor, boxW, boxH);
    // roundedImage(ctx, 30, 30, boxW, boxH, 40);
    ctx.fillStyle = '#2465D3'
      // ctx.lineWidth = 25;
    ctx.fill()
    ctx.clip();

    // ctx.drawImage(image, -30, 30, boxW, boxH);
    ctx.restore();
    // We draw the original box
    // ctx.clearRect(x, y, boxW, boxH);
    // ctx.rect(x, y, boxW, boxH);
    // ctx.stroke();
  }

  const draw = context => {
    // context.beginPath();
    // context.arc(
    //   canvas.current.width / 2,
    //   canvas.current.height / 2,
    //   canvas.current.width / 2,
    //   0,
    //   2 * Math.PI
    // );
    // context.fill();

    const image = new Image();
    image.src =
      "/thumbnail_bg.jpg";
    image.onload = () => {

      const imgw = 378
      const imgh = 567
      const offset=5
      const border=5
      // console.log(imgw, imgh, offset, border)
      // context.save();
      // roundedImage(context, 0, 0, imgw+90, imgh+90, 40);
      // context.strokeStyle = '#2465D3'
      // context.lineWidth = 25;
      // context.stroke()
      // context.clip();
      // context.drawImage(image, 30, 30, imgw, imgh);
      // context.restore();

      const case1 = {box: {posX: offset, posY: offset, width: imgw, height: imgh}, offsetX: 0, offsetY: 0, blurRadius: 5, spreadRadius: 0, color: '#000000'};
      boxShadow(context, image, case1);
      // context.drawImage(image, 0, 0, 270, 405);

      context.save();
      roundedImage(context, offset + border/2, offset + border/2, imgw-border, imgh-border, 30);
      context.strokeStyle = '#185b8f'
      context.lineWidth = border;
      context.globalAlpha = 1;
      context.stroke()
      context.clip();
      context.globalAlpha = 1;
      context.drawImage(image, offset, offset, imgw, imgh);
      context.restore();

      context.fillStyle = '#ffffff'
      context.font = '16px "Arial"';
      
      const offset1Quarter = offset + border/2 + 12;
      const offset2Quarters = offset + imgw/2;
      // const offset3Quarters = offset - border/2 + imgw - 12; 
      const topOffset = 150;
      // context.fillRect(offset - border/2 + imgw, 0, 2, imgh);
      // context.fillRect(217, 0, 2, imgh);
      // context.fillRect(offset + border/2, 0, 2, imgh);

      const getPlayerName = (name) => {
        return name.length < 17 ? name : (name.substring(0, 15) + '...') 
      }

      const lineHeight = 14;
      for (var i = 0; i < players.length; i+=2) {
        context.shadowColor="#040404";
        context.shadowBlur=0;
        context.lineWidth=2;
        context.textAlign = "start";
        context.strokeText((i+1) + '. ' + getPlayerName(players[i].name), offset1Quarter, topOffset + i*lineHeight);
        context.fillStyle = 'white'
        context.fillText((i+1) + '. ' + getPlayerName(players[i].name), offset1Quarter, topOffset + i*lineHeight);

        if (players[i+1]) {
          context.shadowColor="#040404";
          context.shadowBlur=0;
          context.lineWidth=2;
          context.textAlign = "start";
          context.strokeText((i+2) + '. ' + getPlayerName(players[i+1].name), offset2Quarters+6, topOffset + i*lineHeight);
          context.fillStyle = 'white'
          context.fillText((i+2) + '. ' + getPlayerName(players[i+1].name), offset2Quarters+6, topOffset + i*lineHeight);
        }
      }

      context.textAlign = "center";
      context.font = '32px "Lucida Handwriting"';
      context.shadowColor="#040404";
      context.shadowBlur=2;
      context.lineWidth=0;
      context.strokeText('Thursday', offset2Quarters, 60);
      context.strokeText('9:25 PM - 11:00 PM', offset2Quarters, 100);
      context.fillStyle = 'white'
      // context.lineWidth = 25;
      context.fillText('Thursday', offset2Quarters, 60);
      context.fillText('9:25 PM - 11:00 PM', offset2Quarters, 100);
    };
  };

  const handleShare = async () => {
    canvas.current.toBlob(async (blob) => {
      const data = {
        files: [
          new File([blob], 'image.png', {
            type: blob.type,
          }),
        ],
      };
  
      try {
        if (!(navigator.canShare(data))) {
          throw new Error('Can\'t share data.', data);
        };

        await navigator.share(data);
     } catch (err) {
       console.error(err);
     }
  });
    
}

  return (
    <div className="d-flex flex-column justify-content-center">
      <canvas className="p-2 p-lg-5" ref={canvas} height="577px" width="390px" />
      <Button onClick={handleShare}>Share</Button>
    </div>
  );
}

export default GameThumbnail;
