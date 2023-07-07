import Vue from 'vue';
import vueFilePond, { setOptions } from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

const FilePond = vueFilePond(
	FilePondPluginFileEncode,
	FilePondPluginFileValidateType,
	FilePondPluginImagePreview,
	FilePondPluginImageCrop,
	FilePondPluginImageTransform,
	FilePondPluginImageEdit,
	FilePondPluginImageExifOrientation,
	FilePondPluginImageResize
);

/*setOptions({
	server: {
		url: process.env.RUBY_URL,
		timeout: 7000,
		process: {
			url: '/users/avatar',
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('ruby_jwt')}`,
			},
			onload: (response) => response.key,
			onerror: (response) => response.data,
			ondata: (formData) => {
				formData.append('Hello', 'World');
				return formData;
			},
		},
	},
});*/

Vue.component('FilePond', FilePond);
