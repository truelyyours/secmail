import { https } from 'follow-redirects';

const { storage } = require('../firebase');
const random_name = require('crypto');
const lsbtools = require('./lsb');
const PNG = require('pngjs').PNG;

// HELPER FUNCTIONS:

// Convert Unicode string to a string where each 16-bit unit occupies only one byte
function toBinary(string) {
	/* each 16-bit unit occupies only one byte */
	const codeUnits = new Uint16Array(string.length);
	for (let i = 0; i < codeUnits.length; i++) {
		codeUnits[i] = string.charCodeAt(i);
	}
	
	const arr = new Uint8Array(codeUnits.buffer);
	console.log(String.fromCharCode(arr.j));
	return String.fromCharCode(arr);
}
  
function fromBinary(binary) {
	/* Converts two byte back to 16-bit*/
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

// Get a png image from the firebase storage
async function get_image() {
	// #TODO: Image download is not working properly!! it's async!!! 
	const ref = storage.ref('sauce_png_pics');
	const all_images = await ref.listAll();
	// console.log();
	const img_num = Math.floor(Math.random() * all_images.items.length);
	var request; 
	var img_base64;
	var img_data = "";

	const img_url = await all_images.items[img_num].getDownloadURL();
	request =  https.request(img_url, (response) => {
		console.log("Auto Download stared");
		response.on('data', (chunk) => {
			img_data += chunk;
		}).on('end', () => {
			console.log("Auto Image downloaded");
			// img_base64 = Buffer.from(img_data, 'binary').toString('base64');
			console.log(img_data);
		});
	});
	// console.log(img_base64);
	return img_data;
}

// MAIN FUNCTION
export async function stego(embed, data) {
	// const img = await get_image();
	// console.log("Print this before error:", img);
	var png;
	get_image().then((img) => {
		png = PNG.sync.read(img);
	})
	console.log(png);
	var lsbCount = png.width * png.height * 3;

	console.log('    Image size is: %dx%d', png.width, png.height);
	console.log('    LSBs count: %d', lsbCount);
	console.log('    Maximum capacity: %d', Math.floor(lsbCount/8));

	var hidden_data, t, embedMD5, extractMD5, embed = true;

	if(embed) {
		
		embedMD5 = random_name.createHash('md5').update(data).digest('hex');
		console.log('\n    Embedding %d bytes', data.length);
		console.log('    md5 hash of data: %s\n', embedMD5.match(/.{4}/g).join(' '));

		t = lsbtools.write(png.data, data);

		console.log('    %d bits (%d bytes) of data was written (%d%% of maximum capacity)', t.bitsWrited, t.bitsWrited / 8, (100 * t.bitsWrited / lsbCount).toFixed(2));
		if(t.k > 1) console.log('    %d,%d codes used', t.k, t.n);
		console.log('    %d image bits was changed. This is %d%% of all LSBs.', t.bitsChanged,
			(100 * t.bitsChanged / lsbCount).toFixed(2));
		console.log('    Efficiency: %d bits per one LSB change.', (t.bitsWrited / t.bitsChanged).toFixed(2));
		console.log("PNG IMAGE DATA: ", png);
		return btoa(png.data.toString());
	}
// Will not work!! Need to change the png variable with the file supplied.
	if(!embed){
		hidden_data = lsbtools.read(png.data);
		extractMD5 = random_name.createHash('md5').update(hidden_data).digest('hex');

		console.log('\n    %d bytes was extracted', hidden_data.length);
		console.log('    %d%% of capacity was used', (100 * 8 * (data.length + 4.5) / lsbCount).toFixed(2));
		console.log('    md5 hash of data: %s', extractMD5.match(/.{4}/g).join(' ') +
			(embedMD5? extractMD5==embedMD5?' (ok)':' (FAIL!)':''));
		console.log("Hidden data: ", hidden_data);
		return hidden_data.toString();
	}
}
