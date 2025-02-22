class TestController < ApplicationController
    skip_before_action :verify_authenticity_token, :only => [ :create ]

    def index
        render json: session
    end

    def create
        render json: params, status: :created
    end
end
