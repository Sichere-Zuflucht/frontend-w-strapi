<template>
	<div v-if="editor" class="editor-wrapper">
		<label
			class="editor-label"
			:style="`${editor.isFocused ? 'color: pink' : ''}`"
			>{{ label }}</label
		>
		<div
			class="editor"
			:style="`${editor.isFocused ? 'border-color: pink' : ''}`"
		>
			<div class="menu">
				<div
					label="paragraph"
					type="is-dark"
					:class="`${editor.isActive('paragraph') ? 'is-active' : ''}`"
				>
					<v-icon
						:class="`${
							editor.isActive('paragraph') ? 'theme--dark' : 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().setParagraph().run()"
						>mdi-format-paragraph</v-icon
					>
				</div>
				<div
					label="header1"
					type="is-dark"
					:class="`${
						editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
					}`"
				>
					<v-icon
						:class="`${
							editor.isActive('heading', { level: 1 })
								? 'theme--dark'
								: 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
						>mdi-format-header-1</v-icon
					>
				</div>
				<div
					label="header2"
					type="is-dark"
					:class="`${
						editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
					}`"
				>
					<v-icon
						:class="`${
							editor.isActive('heading', { level: 2 })
								? 'theme--dark'
								: 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
						>mdi-format-header-2</v-icon
					>
				</div>
				<div
					label="header3"
					type="is-dark"
					:class="`${
						editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
					}`"
				>
					<v-icon
						:class="`${
							editor.isActive('heading', { level: 3 })
								? 'theme--dark'
								: 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
						>mdi-format-header-3</v-icon
					>
				</div>
				<span class="mr-2 ml-1" style="border-left: 1px solid black"></span>
				<div
					label="bold"
					type="is-dark"
					:class="`${editor.isActive('bold') ? 'is-active' : ''}`"
				>
					<v-icon
						:class="`${
							editor.isActive('bold') ? 'theme--dark' : 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleBold().run()"
						>mdi-format-bold</v-icon
					>
				</div>
				<div
					label="italic"
					type="is-dark"
					:class="`${editor.isActive('italic') ? 'is-active' : ''}`"
				>
					<v-icon
						:class="`${
							editor.isActive('italic') ? 'theme--dark' : 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleItalic().run()"
						>mdi-format-italic</v-icon
					>
				</div>
				<div
					label="strike"
					type="is-dark"
					:class="`${editor.isActive('strike') ? 'is-active' : ''}`"
				>
					<v-icon
						:class="`${
							editor.isActive('strike') ? 'theme--dark' : 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleStrike().run()"
						>mdi-format-strikethrough</v-icon
					>
				</div>
				<div
					label="bulleted list"
					type="is-dark"
					:class="`${editor.isActive('bulletList') ? 'is-active' : ''}`"
				>
					<v-icon
						:class="`${
							editor.isActive('bulletList') ? 'theme--dark' : 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleBulletList().run()"
						>mdi-format-list-bulleted</v-icon
					>
				</div>
				<div
					label="ordered list"
					type="is-dark"
					:class="`${editor.isActive('orderedList') ? 'is-active' : ''}`"
				>
					<v-icon
						:class="`${
							editor.isActive('orderedList') ? 'theme--dark' : 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleOrderedList().run()"
						>mdi-format-list-numbered</v-icon
					>
				</div>
				<div
					label="code"
					type="is-dark"
					:class="`${editor.isActive('code') ? 'is-active' : ''}`"
				>
					<v-icon
						:class="`${
							editor.isActive('code') ? 'theme--dark' : 'theme--light'
						}`"
						type="is-text"
						size="small"
						@click="editor.chain().focus().toggleCode().run()"
						>mdi-xml</v-icon
					>
				</div>
				<span class="mr-2 ml-1" style="border-left: 1px solid black"></span>
				<div
					label="undo"
					type="is-dark"
					:style="`border-color: ${
						!editor.can().chain().focus().undo().run() ? 'lightgrey' : 'black'
					}`"
				>
					<v-icon
						:disabled="!editor.can().chain().focus().undo().run()"
						type="is-text"
						size="small"
						@click="editor.chain().focus().undo().run()"
						>mdi-undo</v-icon
					>
				</div>
				<div
					label="redo"
					type="is-dark"
					:style="`border-color: ${
						!editor.can().chain().focus().redo().run() ? 'lightgrey' : 'black'
					}`"
				>
					<v-icon
						:disabled="!editor.can().chain().focus().redo().run()"
						type="is-text"
						size="small"
						@click="editor.chain().focus().redo().run()"
						>mdi-redo</v-icon
					>
				</div>
			</div>
			<editor-content class="input-field" :editor="editor" />
		</div>
	</div>
</template>

<script>
	import { Editor, EditorContent } from '@tiptap/vue-2';
	import StarterKit from '@tiptap/starter-kit';

	export default {
		components: {
			EditorContent,
		},

		props: {
			value: {
				type: String,
				default: '',
			},
			label: {
				type: String,
				default: '',
			},
		},

		data() {
			return {
				editor: null,
			};
		},

		watch: {
			value(value) {
				// HTML
				const isSame = this.editor.getHTML() === value;

				// JSON
				// const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

				if (isSame) {
					return;
				}

				this.editor.commands.setContent(value, false);
			},
		},

		mounted() {
			this.editor = new Editor({
				content: this.value,
				extensions: [StarterKit],
				onUpdate: () => {
					// HTML
					this.$emit('input', this.editor.getHTML());
					if (this.editor.getHTML().length > 9) this.$emit('filled', true);
					else this.$emit('filled', false);

					// JSON
					// this.$emit('input', this.editor.getJSON())
				},
			});
		},

		beforeDestroy() {
			this.editor.destroy();
		},
	};
</script>

<style lang="scss">
	.editor-wrapper {
		position: relative;
		padding-top: 10px;
	}
	.editor-wrapper .editor {
		border: 2px solid lightgray;
		border-radius: 5px;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.editor-wrapper .editor-label {
		position: absolute;
		top: 12px;
		left: 10px;
		padding: 0 2px;
		background-color: white;
		color: grey;
		font-size: 12px;
		transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}
	.editor-wrapper .menu {
		border-bottom: 1px solid lightgray;
		padding: 15px 10px 12px;
	}
	.editor-wrapper .menu div {
		display: inline-flex;
		border-radius: 5px;
		padding: 4px;
		border: 1px solid black;
	}
	.editor-wrapper .input-field {
		padding: 10px;
		max-height: 400px;
		overflow-y: scroll;
		border: none !important;
		outline: none !important;
	}
	.editor-wrapper .ProseMirror {
		outline: none !important;
		min-height: 200px;
	}
	.editor-wrapper .is-active {
		font-weight: 800;
		background-color: black;
	}
</style>
