<script lang="ts" setup>
    import { useData } from 'vitepress';
    import { useSidebar } from 'vitepress/theme';
    import { mdLinkToHtmlLink, routeNameOfDocument } from './shared/utils';
    import { DefaultTheme } from 'vitepress'
    import { useRouter } from 'vitepress';
    
    const { params } = useData();
    const { sidebarGroups } = useSidebar();
    //redirecting made no frontmatter???
    window.location.replace(getFirstDocLink(sidebarGroups.value, params.value!.docRoute));

    function getFirstDocLink(sidebarItems: DefaultTheme.SidebarItem[], docRoute:string): string {
        const parent = sidebarItems.filter(x => routeNameOfDocument(x.text!) === docRoute)[0];
        if (parent.items?.every(x => !x.link)) {
            return mdLinkToHtmlLink((parent.items[0])!.items![0].link!);
        }
        return mdLinkToHtmlLink(parent.items![0].link!);
    }
</script>
