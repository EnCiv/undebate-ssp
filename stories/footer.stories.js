import React from 'react';

import { Footer } from '../app/components/footer'

export default {
  title: 'Footer',
  component: Footer,
  argTypes: {
  },
};

const Template = (args) => <Footer {...args} />;

export const FooterTest = Template.bind({});
FooterTest.args = {};
