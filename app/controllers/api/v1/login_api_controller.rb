module Api
    module V1
        class LoginApiController < ApiController
            def health
                render json: {status: 'OK'}
            end
        end
    end
end