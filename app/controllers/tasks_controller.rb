class TasksController < ApplicationController
  before_action :set_task, only: [:show, :edit, :update, :destroy]
  before_action :count_left

  # GET /tasks
  # GET /tasks.json
  def index
    @tasks = Task.all
    @states = State.all
  end

  # GET /tasks/1
  # GET /tasks/1.json
  def show
  end

  # GET /tasks/new
  def new
    @task = Task.new
    @states = State.all
    count_left
  end

  # GET /tasks/1/edit
  def edit
    @states = State.all
    count_left
  end

  # POST /tasks
  # POST /tasks.json
  def create
    @task = Task.new(task_params)
    respond_to do |format|
      if @task.save
        count_left
        format.html { redirect_to @task, notice: 'Task was successfully created.' }
        format.json { render json: {:task => @task, 
                                    :left => @left }} #:show, status: :created, location:
      else
        format.html { render :new }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tasks/1
  # PATCH/PUT /tasks/1.json
  def update
    respond_to do |format|
      if @task.update(task_params)
        count_left
        format.html { redirect_to @task, notice: 'Task was successfully updated.' }
        format.json { render json: {:task => @task, 
                                    :left => @left }}
      else
        format.html { render :edit }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tasks/1
  # DELETE /tasks/1.json
  def destroy
    @task.destroy
    count_left
    respond_to do |format|
      format.html { redirect_to tasks_url, notice: 'Task was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def update_all
    state = Task.update_all_json
    count_left
    respond_to do |format|
      format.json { render json: {:state => state.to_json, 
                                  :left => @left }}
    end
  end

  def delete_complited
    response = Task.delete_complited_json
    count_left
    respond_to do |format|
      format.json { render json: response.to_json }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_task
      @task = Task.find(params[:id])
    end

    def count_left
      temp = Task.count_active
      @left = temp.to_s+' item'.pluralize(temp)+' left'
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def task_params
      params.require(:task).permit(:title, :state_id)
    end
end
