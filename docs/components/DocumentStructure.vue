<template>
    <div v-if="currentDoc">
        <table v-if="currentDoc.content.chapters.length > 0">
            <div v-for="chapter in currentDoc.content.chapters">
                <span>{{ chapter.name }}</span>
                <div v-for="f in chapter.filesRelativeToProjectRoot">
                    <a :href="mdLinkToHtmlLink(f)" target="_blank">{{ f }}</a>
                </div>
            </div>
        </table>
        <table v-else>
            <div v-for="f in currentDoc.content.filesRelativeToProjectRoot">
                <a :href="mdLinkToHtmlLink(f)" target="_blank">{{ f }}</a>
            </div>
        </table>
    </div>
</template>

<script setup lang="ts">
    import { mdLinkToHtmlLink } from '../shared/utils';
    import { data as documentInfos } from '../data/Document.data';
    import { withBase } from 'vitepress';
    import { useSidebar } from 'vitepress/theme';
    import { onMounted } from 'vue';
    import { getPrevNext } from '../shared/utils';
    const props = defineProps<{ docRoute: string }>();
    const currentDoc = documentInfos.filter(x => x.docRoute === props.docRoute)[0];
    const prevNext = getPrevNext(props.docRoute, currentDoc);
    onMounted(() => {
        console.log(currentDoc);
        console.log(prevNext);
    });
</script>
