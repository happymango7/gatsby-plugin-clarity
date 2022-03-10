exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    clarity_project_id: Joi.string()
      .description(
        `[string] defines clarity project ID, The plugin will not work without it.`
      )
      .required(),
    enable_on_dev_env: Joi.boolean()
      .default(true)
      .description(
        `[boolean] define whether to inject clarity tracking code on developing environment, defaults to true`
      ),
    delayLoad: Joi.boolean()
      .default(false)
      .description(
        `[boolean] define whether to load clarity after a user action 9scroll or route change) + delay`
      ),
    delayLoadTime: Joi.number()
      .default(1000)
      .description(
        `[number] define time to wait after scroll action in ms. Defaults to 1000ms`
      )
  });
};
