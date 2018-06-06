export interface Job{ 
    id?:number,
    user_id:number,
    title:string,
    category_id:number,
    company_id:number,
    positions:number,
    address1:string,
    address2:string,   
    pincode:string,
    description:string,
    state_id:number,  
    city_id:number, 
    startdate:string, 
    enddate:string, 
    starttime:string,  
    endtime:string, 
    jobcost:string, 
    buyer_cost:string,
    filename:string, 
    allowbids:number, 
    allowbid_cost:string,
    idproof:number,
    dated:string, 
    include_value:string, 
    iscomplete:number, 
    iscompany_address:number,
    status:number, 
    job_status:number,
    created:string, 
    modified:string,      
}