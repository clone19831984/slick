import Middleware from "@src/core/domains/http/base/Middleware";
import { IHttpContext } from "@src/core/domains/http/interfaces/IHttpContext";
import { CustomValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";

/**
 * Validator middleware for validating the request body
 * 
 * This middleware validates the request body against the validator constructor
 * and sets the validated body on the request.
 */
class ValidatorMiddleware extends Middleware {

    /**
     * Executes the validator middleware
     * @param context - The HTTP context
     */
    public async execute(context: IHttpContext): Promise<void> {
        const validatorConstructors = this.getValidatorConstructors(context);

        // No validator constructor, skip validation
        if (validatorConstructors.length === 0) {
            this.next();
            return;
        }

        for (const validatorConstructor of validatorConstructors) {
            const validator = new validatorConstructor();
            validator.setHttpContext(context)

            const data = {
                ...(context.getParams()),
                ...(context.getRequest().body),
            }

            const result = await validator.validate(data);

            // Validation failed, return the errors
            if (result.fails()) {
                context.getResponse().status(422).json({
                    errors: result.errors()
                });
                return;
            }

            // Set the validated body on the request
            context.getRequest().body = { ...context.getRequest().body, ...result.validated() };
        }

        this.next();
    }

    /**
     * Get the validator constructor from the route item
     * @param context - The HTTP context
     * @returns The validator constructor
     */
    protected getValidatorConstructors(context: IHttpContext): CustomValidatorConstructor[] {
        const validatorConstructors = context.getRouteItem()?.validator ?? [];
        return Array.isArray(validatorConstructors) ? validatorConstructors : [validatorConstructors];
    }

}

export default ValidatorMiddleware;
