import { https } from 'follow-redirects';
import { images_base64 } from './images';

const { storage } = require('../firebase');
const random_name = require('crypto');
const lsbtools = require('./lsb');
const PNG = require('pngjs').PNG;


// Get a png image from the firebase storage. Firebase is not async and that's an issue. We need it to be async for this func
async function get_image() {
	const ref = storage.ref('sauce_png_pics');
	const all_images = await ref.listAll();
	const img_num = Math.floor(Math.random() * all_images.items.length);
	const img_name = all_images.items[img_num].name;
	console.log(img_name);
	// storage.ref('sauce_png_pics').child(img_name).
	const img_url = await all_images.items[img_num].getDownloadURL();

	var request, img_data = "";

	request = https.request(img_url, (response) => {
		console.log("Image download started!");
		response.on('data', (chunk) => {
			img_data += chunk;
		}).on("end", () => {
			console.log(img_data);
			return img_data;
		});
	});
}

// MAIN FUNCTION
export function stego(embed, data) {
	// Get a random image from images.js file. it has an array of images in base64.

	const images_arr = images_base64;
	const img_num = Math.floor(Math.random() * images_arr.length);

	var png = PNG.sync.read(Buffer.from(images_arr[img_num],'base64'));
	return images_arr[img_num];
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
		console.log("PNG IMAGE DATA: ", png.data.toString());
		// console.log(png.data, png.data.toString('utf-8').length);
		return png.data.toString();
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
