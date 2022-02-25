import dgram from 'dgram';

const receiver = dgram.createSocket('udp4');

receiver.on('error', (err: any) => {
  console.log(`UDP receiver error:\n${err}`);
  receiver.close();
});

receiver.on('message', (msg: any, rinfo: { address: any; port: any; }) => {
  console.log(`UDP receiver got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

receiver.on('listening', () => {
  const address = receiver.address();
  console.log(`UDP receiver listening at ${address.address}:${address.port}`);
});

receiver.bind(5000);
