function schemaValidator(obj, schema) {
	const errors = [];

	for (const key in schema) {
		const expectedType = schema[key];
		const actualValue = obj[key];
		const actualType = typeof actualValue;

		if (
			actualValue === undefined ||
			actualValue === null ||
			(typeof actualValue === "string" && actualValue.trim() === "")
		) {
			errors.push(`Missing required parameter: ${key}`);
		} else if (actualType !== expectedType) {
			errors.push(`${key} expected ${expectedType} found ${actualType}`);
		}
	}

	return errors;
}

function modelSettingsValidator(obj) {
	const errors = [];
	const fields = {
		model: "string",
		systemPrompt: "string",
		temprature: "number",
		retrainAfter: "number",
	};
	const supportedModels = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"];

	for (const key in fields) {
		const expectedType = fields[key];
		const actualValue = obj[key];
		const actualType = typeof actualValue;

		if (actualValue === undefined || actualValue === null) {
			errors.push(`Missing required parameter: ${key}`);
		} else if (actualType !== expectedType) {
			errors.push(`${key} expected ${expectedType} found ${actualType}`);
		}
	}

	if (obj.temprature < 0 || obj.temprature > 1) {
		errors.push(`Temprature must be between 0 and 1`);
	}

	if (!supportedModels.includes(obj.model)) {
		errors.push(`Unsupported model: ${obj.model}`);
	}

	return errors;
}

module.exports = { schemaValidator, modelSettingsValidator };
