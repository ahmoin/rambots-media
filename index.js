import satori from 'satori';
import sharp from 'sharp';
import fs from 'fs';

const svg = fs.readFileSync('./ram-head.svg', 'utf-8');

async function generateImage() {
  const fontBuffer = fs.readFileSync('./Geist-Medium.otf');

  const svgBuffer = Buffer.from(svg);
  const base64Svg = `data:image/svg+xml;base64,${svgBuffer.toString('base64')}`;

  const svgBuffer2 = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontSize: 384,
          fontWeight: 600,
          fontFamily: 'Geist',
        },
        children: [
          {
            type: 'img',
            props: {
              src: base64Svg,
              width: 2000,
              height: 1255,
            }
          },
          {
            type: 'div',
            props: {
              style: { marginTop: 40 },
              children: 'Rambots'
            }
          }
        ]
      }
    },
    {
      width: 2000,
      height: 2000,
      fonts: [
        {
          name: 'Geist',
          data: fontBuffer,
          weight: 600,
          style: 'normal',
        }
      ],
      debug: false,
    }
  );

  await sharp(Buffer.from(svgBuffer2))
    .png()
    .toFile('output.png');
}

generateImage().catch(console.error); 
