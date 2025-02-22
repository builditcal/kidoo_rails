module Api
    module V1
        class LoginApiController < ApiController
            def login
                puts "here here here"
                puts "here here here"
                puts "here here here"
                puts "here here here"
                if user = User.authenticate_by(params.permit(:email_address, :password))
                    # start_new_session_for user
                    session["user_id"] = user.id
                    render json: {status: 'SUCCESS', message: 'Logged in', data: user}, status: :ok
                  else
                    render json: {status: 'ERROR', message: 'Invalid email or password'}, status: :unprocessable_entity
                  end
            end

            def set_default_format
                request.format = :json
            end
        end
    end
end