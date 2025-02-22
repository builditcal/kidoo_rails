class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }
  skip_before_action :verify_authenticity_token, :only => [:create]

  def new
    if session[:user_id]
      redirect_to "/dashboard"
    end
  end

  def create
    user = User.authenticate_by(params.permit(:email_address, :password))
    if user
      start_new_session_for user
      render json: { location: "/dashboard" }
    else
      render json: { errorMessage: "The login details are incorrect, Please double check them and try again." }, status: 400
    end
  end

  def destroy
    terminate_session
    redirect_to new_session_path
  end
end
