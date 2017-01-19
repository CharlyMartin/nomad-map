class PagesController < ApplicationController
  skip_before_action :authenticate_nomad!, only: [:home, :nomad_around]

  def home
  end

  def nomad_around
    location_params[:location]
    @nomads_around = Nomad.near(location_params[:location], 50).all[0..-1]
  end

  private

  def location_params
    params.require(:location).permit(:location)
  end
end
