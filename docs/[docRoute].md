---
page: true
aside: false
---

<!-- <DocumentStructure :doc-route="params!.docRoute"/> -->

<script lang="ts" setup>
    import { useData } from 'vitepress';
    import { useSidebar } from 'vitepress/theme';
    import { mdLinkToHtmlLink, routeNameOfDocument } from './shared/utils';
    import { DefaultTheme } from 'vitepress'
    
    const { params } = useData();
    const { sidebarGroups } = useSidebar();

    window.location.href = getFirstDocLink(sidebarGroups.value, params.value!.docRoute);
    console.log(sidebarGroups.value[0].collapsed);
    sidebarGroups.value[0].collapsed = false;

    function getFirstDocLink(sidebarItems: DefaultTheme.SidebarItem[],docRoute:string):string{
        const parent = sidebarItems.filter(x => routeNameOfDocument(x.text!) === docRoute)[0];
        if (parent.items?.every(x => !x.link)) {
            return mdLinkToHtmlLink((parent.items[0])!.items![0].link!);
        }
        return mdLinkToHtmlLink(parent.items![0].link!);
    }
</script>
