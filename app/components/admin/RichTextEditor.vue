<template>
    <div class="rich-text-editor">
        <div
            v-if="editor"
            class="editor-toolbar d-flex flex-wrap align-center ga-1 pa-2"
        >
            <v-btn
                icon
                size="small"
                :variant="editor.isActive('bold') ? 'flat' : 'text'"
                :color="editor.isActive('bold') ? 'primary' : undefined"
                @click="editor.chain().focus().toggleBold().run()"
            >
                <v-icon icon="mdi-format-bold" />
            </v-btn>

            <v-btn
                icon
                size="small"
                :variant="editor.isActive('italic') ? 'flat' : 'text'"
                :color="editor.isActive('italic') ? 'primary' : undefined"
                @click="editor.chain().focus().toggleItalic().run()"
            >
                <v-icon icon="mdi-format-italic" />
            </v-btn>

            <v-btn
                icon
                size="small"
                :variant="editor.isActive('strike') ? 'flat' : 'text'"
                :color="editor.isActive('strike') ? 'primary' : undefined"
                @click="editor.chain().focus().toggleStrike().run()"
            >
                <v-icon icon="mdi-format-strikethrough" />
            </v-btn>

            <v-divider vertical class="mx-1" />

            <v-btn
                size="small"
                :variant="
                    editor.isActive('heading', { level: 1 }) ? 'flat' : 'text'
                "
                :color="
                    editor.isActive('heading', { level: 1 })
                        ? 'primary'
                        : undefined
                "
                @click="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
            >
                H1
            </v-btn>

            <v-btn
                size="small"
                :variant="
                    editor.isActive('heading', { level: 2 }) ? 'flat' : 'text'
                "
                :color="
                    editor.isActive('heading', { level: 2 })
                        ? 'primary'
                        : undefined
                "
                @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
            >
                H2
            </v-btn>

            <v-btn
                size="small"
                :variant="
                    editor.isActive('heading', { level: 3 }) ? 'flat' : 'text'
                "
                :color="
                    editor.isActive('heading', { level: 3 })
                        ? 'primary'
                        : undefined
                "
                @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
            >
                H3
            </v-btn>

            <v-divider vertical class="mx-1" />

            <v-btn
                icon
                size="small"
                :variant="editor.isActive('bulletList') ? 'flat' : 'text'"
                :color="editor.isActive('bulletList') ? 'primary' : undefined"
                @click="editor.chain().focus().toggleBulletList().run()"
            >
                <v-icon icon="mdi-format-list-bulleted" />
            </v-btn>

            <v-btn
                icon
                size="small"
                :variant="editor.isActive('orderedList') ? 'flat' : 'text'"
                :color="editor.isActive('orderedList') ? 'primary' : undefined"
                @click="editor.chain().focus().toggleOrderedList().run()"
            >
                <v-icon icon="mdi-format-list-numbered" />
            </v-btn>

            <v-divider vertical class="mx-1" />

            <v-btn
                icon
                size="small"
                :variant="editor.isActive('blockquote') ? 'flat' : 'text'"
                :color="editor.isActive('blockquote') ? 'primary' : undefined"
                @click="editor.chain().focus().toggleBlockquote().run()"
            >
                <v-icon icon="mdi-format-quote-close" />
            </v-btn>

            <v-btn
                icon
                size="small"
                :variant="editor.isActive('codeBlock') ? 'flat' : 'text'"
                :color="editor.isActive('codeBlock') ? 'primary' : undefined"
                @click="editor.chain().focus().toggleCodeBlock().run()"
            >
                <v-icon icon="mdi-code-tags" />
            </v-btn>

            <v-btn
                icon
                size="small"
                variant="text"
                @click="editor.chain().focus().setHorizontalRule().run()"
            >
                <v-icon icon="mdi-minus" />
            </v-btn>

            <v-divider vertical class="mx-1" />

            <v-btn
                icon
                size="small"
                :variant="editor.isActive('link') ? 'flat' : 'text'"
                :color="editor.isActive('link') ? 'primary' : undefined"
                @click="openLinkDialog"
            >
                <v-icon icon="mdi-link" />
            </v-btn>

            <v-btn icon size="small" variant="text" @click="openImageDialog">
                <v-icon icon="mdi-image" />
            </v-btn>

            <v-divider vertical class="mx-1" />

            <v-btn
                icon
                size="small"
                variant="text"
                :disabled="!editor.can().undo()"
                @click="editor.chain().focus().undo().run()"
            >
                <v-icon icon="mdi-undo" />
            </v-btn>

            <v-btn
                icon
                size="small"
                variant="text"
                :disabled="!editor.can().redo()"
                @click="editor.chain().focus().redo().run()"
            >
                <v-icon icon="mdi-redo" />
            </v-btn>
        </div>

        <v-divider />

        <EditorContent :editor="editor" class="editor-content" />

        <v-dialog v-model="linkDialog" max-width="440">
            <v-card>
                <v-card-title>Insert Link</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="linkUrl"
                        label="URL"
                        variant="outlined"
                        placeholder="https://example.com"
                        autofocus
                        hide-details
                        @keydown.enter="insertLink"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="linkDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn
                        v-if="editor?.isActive('link')"
                        color="error"
                        variant="text"
                        @click="removeLink"
                    >
                        Remove
                    </v-btn>
                    <v-btn color="primary" variant="flat" @click="insertLink"
                        >Apply</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="imageDialog" max-width="440">
            <v-card>
                <v-card-title>Insert Image</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="imageUrl"
                        label="Image URL"
                        variant="outlined"
                        placeholder="https://example.com/image.jpg"
                        autofocus
                        hide-details
                        @keydown.enter="insertImage"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="imageDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn color="primary" variant="flat" @click="insertImage"
                        >Insert</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

interface Props {
    modelValue?: string;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    placeholder: "",
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

const linkDialog = ref(false);
const linkUrl = ref("");
const imageDialog = ref(false);
const imageUrl = ref("");

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        Image.configure({
            inline: false,
            allowBase64: true,
        }),
        Link.configure({
            openOnClick: false,
            autolink: true,
        }),
    ],
    onUpdate({ editor: e }) {
        emit("update:modelValue", e.getHTML());
    },
});

watch(
    () => props.modelValue,
    (newVal) => {
        if (editor.value && newVal !== editor.value.getHTML()) {
            editor.value.commands.setContent(newVal, false);
        }
    },
);

function openLinkDialog() {
    if (!editor.value) return;
    const existing = editor.value.getAttributes("link").href;
    linkUrl.value = existing || "";
    linkDialog.value = true;
}

function insertLink() {
    if (!editor.value) return;
    if (!linkUrl.value) {
        removeLink();
        return;
    }
    editor.value
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl.value })
        .run();
    linkDialog.value = false;
    linkUrl.value = "";
}

function removeLink() {
    if (!editor.value) return;
    editor.value.chain().focus().unsetLink().run();
    linkDialog.value = false;
    linkUrl.value = "";
}

function openImageDialog() {
    imageUrl.value = "";
    imageDialog.value = true;
}

function insertImage() {
    if (!editor.value || !imageUrl.value) return;
    editor.value.chain().focus().setImage({ src: imageUrl.value }).run();
    imageDialog.value = false;
    imageUrl.value = "";
}

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<style scoped>
.rich-text-editor {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 4px;
    overflow: hidden;
}

.editor-toolbar {
    background: rgba(var(--v-theme-surface-variant), 0.3);
}

.editor-content {
    min-height: 300px;
}

.editor-content :deep(.tiptap) {
    min-height: 300px;
    padding: 16px;
    outline: none;
}

.editor-content :deep(.tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: rgba(var(--v-theme-on-surface), 0.4);
    pointer-events: none;
    height: 0;
}

/* Prose-like typography */
.editor-content :deep(.tiptap h1) {
    font-size: 2em;
    font-weight: 700;
    margin: 1em 0 0.5em;
    line-height: 1.2;
}

.editor-content :deep(.tiptap h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin: 0.8em 0 0.4em;
    line-height: 1.3;
}

.editor-content :deep(.tiptap h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin: 0.6em 0 0.3em;
    line-height: 1.4;
}

.editor-content :deep(.tiptap p) {
    margin: 0.5em 0;
    line-height: 1.7;
}

.editor-content :deep(.tiptap ul),
.editor-content :deep(.tiptap ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.editor-content :deep(.tiptap li) {
    margin: 0.25em 0;
}

.editor-content :deep(.tiptap li p) {
    margin: 0;
}

.editor-content :deep(.tiptap blockquote) {
    border-left: 4px solid rgb(var(--v-theme-primary));
    padding-left: 1em;
    margin: 1em 0;
    font-style: italic;
    color: rgba(var(--v-theme-on-surface), 0.7);
}

.editor-content :deep(.tiptap pre) {
    background: rgba(var(--v-theme-on-surface), 0.08);
    border-radius: 6px;
    padding: 12px 16px;
    margin: 1em 0;
    overflow-x: auto;
    font-family: "Fira Code", "Cascadia Code", "Consolas", monospace;
    font-size: 0.9em;
    line-height: 1.5;
}

.editor-content :deep(.tiptap pre code) {
    background: none;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
    color: inherit;
}

.editor-content :deep(.tiptap code) {
    background: rgba(var(--v-theme-on-surface), 0.08);
    border-radius: 4px;
    padding: 2px 6px;
    font-family: "Fira Code", "Cascadia Code", "Consolas", monospace;
    font-size: 0.9em;
}

.editor-content :deep(.tiptap img) {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 1em 0;
    display: block;
}

.editor-content :deep(.tiptap hr) {
    border: none;
    border-top: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
    margin: 1.5em 0;
}

.editor-content :deep(.tiptap a) {
    color: rgb(var(--v-theme-primary));
    text-decoration: underline;
    cursor: pointer;
}

.editor-content :deep(.tiptap a:hover) {
    opacity: 0.8;
}
</style>
