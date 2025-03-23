import React from 'react';
import './Home.css';

const Contact = () =>{
     return(
     <>
     <div className="container py-5">
       <div className="row justify-content-center">
         <div className="col-md-10">
           <div className="card shadow-lg border-0">
             <div className="card-header bg-primary text-white">
               <h3 className="mb-0">Contact Us</h3>
               <p className="mb-0">Have questions about our products? Fill out the form below and we'll get back to you.</p>
             </div>
             <div className="card-body p-4">
               <form className="row g-3">
        <div className="col-md-6">
          <label htmlFor="inputName" className="form-label">Name</label>
          <input type="name" className="form-control" id="inputNAme" />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputEmail" className="form-label">Email</label>
          <input type="Email" className="form-control" id="inputEmail" />
        </div>
        <div className="col-12">
          <label htmlFor="inputMobile Model Name" className="form-label">Mobile Model Name</label>
          <input type="text" className="form-control" id="inputMobile Model Name" placeholder="Oppo,Realme" />
        </div>
        <div className="col-12">
          <label htmlFor="inputAny Query" className="form-label">Any Query</label>
          <input type="text" className="form-control" id="inputAddress2" placeholder="Query" />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputCity" className="form-label">City</label>
          <input type="text" className="form-control" id="inputCity" />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputState" className="form-label">State</label>
          <select id="inputState" className="form-select">
            <option selected>Choose...</option>
            <option>...</option>
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="inputZip" className="form-label">Zip</label>
          <input type="text" className="form-control" id="inputZip" />
        </div>
        <div className="col-12">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="gridCheck" />
            <label className="form-check-label" htmlFor="gridCheck">
              Check me out
            </label>
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary btn-lg">Submit Request</button>
        </div>
      </form>
             </div>
           </div>
           
           <div className="card mt-4 shadow-lg border-0">
             <div className="card-body p-4">
               <div className="row">
                 <div className="col-md-4 mb-3 mb-md-0">
                   <div className="d-flex align-items-center">
                     <div className="icon-square bg-primary text-white rounded-circle p-2 me-3">
                       <i className="fas fa-map-marker-alt"></i>
                     </div>
                     <div>
                       <h5 className="mb-1">Our Location</h5>
                       <p className="mb-0">Sector-71, Mohali, Chandigarh</p>
                     </div>
                   </div>
                 </div>
                 <div className="col-md-4 mb-3 mb-md-0">
                   <div className="d-flex align-items-center">
                     <div className="icon-square bg-primary text-white rounded-circle p-2 me-3">
                       <i className="fas fa-phone"></i>
                     </div>
                     <div>
                       <h5 className="mb-1">Call Us</h5>
                       <p className="mb-0">+91 8507931092</p>
                     </div>
                   </div>
                 </div>
                 <div className="col-md-4">
                   <div className="d-flex align-items-center">
                     <div className="icon-square bg-primary text-white rounded-circle p-2 me-3">
                       <i className="fas fa-envelope"></i>
                     </div>
                     <div>
                       <h5 className="mb-1">Email Us</h5>
                       <p className="mb-0">rishuarora850727@gmail.com</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
     </>
);


};

export default Contact;