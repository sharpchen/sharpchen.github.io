<script lang="ts" setup>
    import { useData } from 'vitepress';
    import { onMounted } from 'vue';
    import { useSidebar } from 'vitepress/theme';
    import { mdLinkToHtmlLink, routeNameOfDocument } from './shared/utils';
    import { DefaultTheme } from 'vitepress'
    import Enumerable from 'linq';
    
    const { params } = useData();
    onMounted(() => {
        const { sidebarGroups } = useSidebar();
        console.log(`first link of ${params.value!.docRoute}`,getFirstDocLink(sidebarGroups.value, params.value!.docRoute))
        window.location.replace(getFirstDocLink(sidebarGroups.value, params.value!.docRoute));
    })

    function getFirstDocLink(sidebarItems: DefaultTheme.SidebarItem[], docRoute: string): string {
        const textWithoutEmoji = (text: string): string => {
            const split = text.split(' ');
            return (Enumerable.from(split).skip(1).select(x => x.trim()).toArray()).join('');
        }
        const parent = sidebarItems.find(x => routeNameOfDocument(textWithoutEmoji(x.text!)) === docRoute);
        if (parent) {
            if (parent.items?.every(x => !x.link)) {
                return mdLinkToHtmlLink((parent.items[0])!.items![0].link!);
            }
            return mdLinkToHtmlLink(parent.items![0].link!);
        }
        throw new Error(`No matched parent for ${docRoute}`);
    }
</script>
