<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <div :class="ui.body({ class: props.ui?.body })">
      <slot />
    </div>

    <div :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </div>
</template>
