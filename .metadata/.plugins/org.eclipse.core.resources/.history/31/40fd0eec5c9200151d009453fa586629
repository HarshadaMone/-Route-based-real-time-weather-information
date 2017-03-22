package com.model.assignment1;

public class ResourceAtr {

	private Integer objId;
	private Integer resourceId;
	private Integer objInstanceId;
	private Integer minPeriod;
	private Integer maxPeriod;
	private Integer greaterThan;
	private Integer lessThan;
	private Integer step;
	private Integer cancel;
	
	public static ResourceAtr map(ResourceAtr previous, ResourceAtr req) {
		ResourceAtr response = new ResourceAtr();
		response.setObjId(previous.getObjId());
		response.setObjInstanceId(previous.getObjInstanceId());
		response.setResourceId(previous.getResourceId());
		if(req.getMinPeriod() != null){
			response.setMinPeriod(req.getMinPeriod());
		} else {
			response.setMinPeriod(previous.getMinPeriod());
		}
		if(req.getMaxPeriod() != null){
			response.setMaxPeriod(req.getMaxPeriod());
		} else {
			response.setMaxPeriod(previous.getMaxPeriod());
		}
		if(req.getGreaterThan() != null){
			response.setGreaterThan(req.getGreaterThan());
		} else {
			response.setGreaterThan(previous.getGreaterThan());
		}
		if(req.getLessThan() != null){
			response.setLessThan(req.getLessThan());
		} else {
			response.setLessThan(previous.getLessThan());
		}
		if(req.getStep() != null){
			response.setStep(req.getStep());
		} else {
			response.setStep(previous.getStep());
		}
		if(req.getCancel() != null){
			response.setCancel(req.getCancel());
		} else {
			response.setCancel(previous.getCancel());
		}
		return response;
	}
	
	public Integer getObjId() {
		return objId;
	}
	public void setObjId(Integer objId) {
		this.objId = objId;
	}
	public Integer getResourceId() {
		return resourceId;
	}
	public void setResourceId(Integer resourceId) {
		this.resourceId = resourceId;
	}
	public Integer getObjInstanceId() {
		return objInstanceId;
	}
	public void setObjInstanceId(Integer objInstanceId) {
		this.objInstanceId = objInstanceId;
	}
	public Integer getMinPeriod() {
		return minPeriod;
	}
	public void setMinPeriod(Integer minPeriod) {
		this.minPeriod = minPeriod;
	}
	public Integer getMaxPeriod() {
		return maxPeriod;
	}
	public void setMaxPeriod(Integer maxPeriod) {
		this.maxPeriod = maxPeriod;
	}
	public Integer getGreaterThan() {
		return greaterThan;
	}
	public void setGreaterThan(Integer greaterThan) {
		this.greaterThan = greaterThan;
	}
	public Integer getLessThan() {
		return lessThan;
	}
	public void setLessThan(Integer lessThan) {
		this.lessThan = lessThan;
	}
	public Integer getStep() {
		return step;
	}
	public void setStep(Integer step) {
		this.step = step;
	}
	public Integer getCancel() {
		return cancel;
	}
	public void setCancel(Integer cancel) {
		this.cancel = cancel;
	}
	
	
}
