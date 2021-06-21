// Styles
import './VListItem.sass'

// Components
import {
  VListItemAvatar,
  VListItemHeader,
  VListItemSubtitle,
  VListItemTitle,
} from './'
import { VAvatar } from '@/components/VAvatar'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useColor } from '@/composables/color'
import { makeThemeProps, useTheme } from '@/composables/theme'
import { makeRouterProps, useLink } from '@/composables/router'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { computed, defineComponent } from 'vue'
import { makeProps } from '@/util'

export default defineComponent({
  name: 'VListItem',

  directives: { Ripple },

  props: makeProps({
    active: Boolean,
    activeColor: String,
    activeClass: String,
    appendAvatar: String,
    appendIcon: String,
    color: String,
    disabled: Boolean,
    link: Boolean,
    prependAvatar: String,
    prependIcon: String,
    subtitle: String,
    contained: String,
    title: String,

    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeRouterProps(),
  }),

  setup (props, { attrs, slots }) {
    const { themeClasses } = useTheme(props)
    const { colorClasses, colorStyles } = useColor(computed(() => {
      const key = props.contained && props.active ? 'background' : 'text'
      const color = (props.active && props.activeColor) || props.color

      return { [`${key}`]: color }
    }))
    const { borderClasses } = useBorder(props, 'v-list-item')
    const { densityClasses } = useDensity(props, 'v-list-item')
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { roundedClasses } = useRounded(props, 'v-list-item')
    const link = useLink(props)

    return () => {
      const hasTitle = (slots.title || props.title)
      const hasSubtitle = (slots.subtitle || props.subtitle)
      const hasHeader = !!(hasTitle || hasSubtitle)
      const hasAppend = (slots.append || props.appendAvatar || props.appendIcon)
      const hasPrepend = (slots.prepend || props.prependAvatar || props.prependIcon)
      const isLink = !!(props.link || link.isLink.value || attrs.onClick || attrs.onClickOnce)
      const isClickable = isLink && !props.disabled
      const isActive = props.active || link.isExactActive?.value

      return (
        <props.tag
          class={[
            'v-list-item',
            {
              'v-list-item--active': isActive,
              'v-list-item--disabled': props.disabled,
              'v-list-item--link': isLink,
              'v-list-item--contained': props.contained,
              [`${props.activeClass}`]: isActive && props.activeClass,
            },
            themeClasses.value,
            colorClasses.value,
            borderClasses.value,
            densityClasses.value,
            elevationClasses.value,
            roundedClasses.value,
          ]}
          style={[
            colorStyles.value,
            dimensionStyles.value,
          ]}
          href={ link.href?.value }
          tabindex={ isClickable ? 0 : undefined }
          onClick={ isClickable && link?.navigate }
          v-ripple={ isClickable }
        >
          { (isClickable || props.active) && (<div class="v-list-item__overlay" />) }

          { hasPrepend && (
            slots.prepend
              ? slots.prepend()
              : (
                <VListItemAvatar left>
                  <VAvatar
                    density={ props.density }
                    icon={ props.prependIcon }
                    image={ props.prependAvatar }
                  />
                </VListItemAvatar>
              )
          ) }

          { hasHeader && (
            <VListItemHeader>
              { hasTitle && (
                <VListItemTitle>
                  { slots.title
                    ? slots.title()
                    : props.title
                  }
                </VListItemTitle>
              ) }

              { hasSubtitle && (
                <VListItemSubtitle>
                  { slots.subtitle
                    ? slots.subtitle()
                    : props.subtitle
                  }
                </VListItemSubtitle>
              ) }
            </VListItemHeader>
          ) }

          { slots.default?.() }

          { hasAppend && (
            slots.append
              ? slots.append()
              : (
                <VListItemAvatar right>
                  <VAvatar
                    density={ props.density }
                    icon={ props.appendIcon }
                    image={ props.appendAvatar }
                  />
                </VListItemAvatar>
              )
          ) }
        </props.tag>
      )
    }
  },
})