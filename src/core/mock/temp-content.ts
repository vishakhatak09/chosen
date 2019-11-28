// export const templateMock = `
// <div style="margin-top: 20px;">
//     <table cellspacing="0" cellpadding="0" style="font-family: sans-serif; width: 800px; margin: auto;color: #444444;">
//         <tr>
//             <td style="padding: 0 20px">
//                 <table cellspacing="0" cellpadding="0" style="width: 100%">
//                     <tr>
//                         <td>
//                             <h1 style="margin: 0 0 5px; font-size: 24px;font-weight: 500;color: #444444;">
//                                 <span *ngIf="templateForm.firstName">{{templateForm.firstName}} </span>
//                                 <span *ngIf="!templateForm.firstName">John </span>
//                                 <span *ngIf="templateForm.lastName ">{{templateForm.lastName}}</span>
//                                 <span *ngIf="!templateForm.lastName">Doe</span>
//                             </h1>
//                             <h4 style="margin: 0 0 5px; font-size: 16px;font-weight: 500;color: #8c8c8cdd;">
//                                 {{ templateForm.designation }}
//                             </h4>
//                             <p style="margin: 0; font-size: 13px;color: #444444;" [innerHTML]="careerObjective">
//                             </p>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//         <tr>
//             <td style="height: 15px;"></td>
//         </tr>
//         <tr>
//             <td style="background: #eaeaea;padding: 0 30px">
//                 <table cellspacing="0" cellpadding="0" style="width: 100%">
//                     <tr>
//                         <td style="font-size: 12px; padding: 10px 10px;">
//                             <div style="white-space: nowrap;">
//                                 <img style="width: 14px;display: inline-block;vertical-align: middle;"
//                                     src="assets/icons/template-icons/envelope.svg" alt="">
//                                 <span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
//                                     *ngIf="templateForm.email" [innerHTML]="templateForm.email">
//                                 </span>
//                                 <span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
//                                     *ngIf="!templateForm.email">john.doe@gmail.com
//                                 </span>
//                             </div>
//                         </td>
//                         <td style="font-size: 12px; padding: 10px 10px;">
//                             <div style="white-space: nowrap;">
//                                 <img style="width: 14px;display: inline-block;vertical-align: middle;"
//                                     src="assets/icons/template-icons/mobile.svg" alt="mobile">
//                                 <span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
//                                     *ngIf="templateForm.contactNumber" [innerHTML]="templateForm.contactNumber">
//                                 </span>
//                                 <span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
//                                     *ngIf="!templateForm.contactNumber">1234567890
//                                 </span>
//                             </div>
//                         </td>
//                         <td style="font-size: 12px; padding: 10px 10px;">
//                             <div style="white-space: nowrap;">
//                                 <img style="width: 14px;display: inline-block;vertical-align: middle;"
//                                     src="assets/icons/template-icons/location.svg" alt="location">
//                                 <span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
//                                     *ngIf="templateForm.fullAddress" [innerHTML]="templateForm.fullAddress">
//                                 </span>
//                                 <span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
//                                     *ngIf="!templateForm.fullAddress"> Lorem ipsum dolor met
//                                 </span>
//                             </div>
//                         </td>
//                         <td style="font-size: 12px; padding: 10px 10px;">
//                             <div style="white-space: nowrap;">
//                                 <img style="width: 14px;display: inline-block;vertical-align: middle;"
//                                     src="assets/icons/template-icons/linkedin.svg" alt="">
//                                 <span
//                                     style="margin-left: 3px;display: inline-block;vertical-align: middle;">linkedin.com/in/john.doe</span>
//                             </div>
//                         </td>
//                         <td style="font-size: 12px; padding: 10px 10px;">
//                             <div style="white-space: nowrap;">
//                                 <img style="width: 14px;display: inline-block;vertical-align: middle;"
//                                     src="assets/icons/template-icons/skype.svg" alt="">
//                                 <span
//                                     style="margin-left: 3px;display: inline-block;vertical-align: middle;">john.doe</span>
//                             </div>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//         <tr>
//             <td style="height: 15px;"></td>
//         </tr>
//         <tr *ngIf="skillData.length > 0">
//             <td style="padding: 0 20px">
//                 <table cellspacing="0" cellpadding="0" style="width: 100%">
//                     <tr>
//                         <td style="font-size: 0;">
//                             <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Areas of expertise</h2>
//                             <p style="margin: 2px 0;font-size: 12px; width: 25%; transition: box-shadow 280ms cubic-bezier(.4,0,.2,1);
//                                 display: inline-flex; padding: 7px 12px; border-radius: 16px; min-height: 32px;
//                                 height: 1px;"  *ngFor="let item of skillData" [ngStyle]="{'color': fontColor ,
//                                 'background-color' : backColor}">
//                                 {{ item.skillName }}
//                             </p>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//         <tr>
//             <td style="height: 25px;"></td>
//         </tr>
//         <tr *ngIf="experienceData.length > 0">
//             <td style="padding: 0 20px">
//                 <table cellspacing="0" cellpadding="0" style="width: 100%">
//                     <tr>
//                         <td>
//                             <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Work experience
//                             </h2>
//                         </td>
//                     </tr>
//                     <tr *ngFor="let item of experienceData">
//                         <td style="font-size: 0; padding: 10px;">
//                             <h3 style="margin:0; font-size: 14px;" [innerHTML]="item.designation"></h3>
//                             <h4 style="margin:2px 0 0; font-size: 13px; color: #909090;"
//                                 [innerHTML]="item.companyName">
//                             </h4>
//                             <div style="margin: 7px 0 5px;">
//                                 <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
//                                             font-size: 10px;color: #909090;">
//                                     {{ item.joiningDate | date: 'LLLL yyyy' }} -
//                                     {{  item.leavingDate | date: 'LLLL yyyy' }}
//                                 </p>
//                                 <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
//                                             font-size: 10px;color: #909090;text-align: right;"
//                                     [innerHTML]="item.location">
//                                 </p>
//                             </div>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//         <tr>
//             <td style="height: 25px;"></td>
//         </tr>
//         <tr *ngIf="educationData.length > 0">
//             <td style="padding: 0 20px">
//                 <table cellspacing="0" cellpadding="0" style="width: 100%">
//                     <tr>
//                         <td>
//                             <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Education Summary
//                             </h2>
//                         </td>
//                     </tr>
//                     <tr *ngFor="let item of educationData">
//                         <td style="font-size: 0; padding: 10px;">
//                             <h3 style="margin:0; font-size: 14px;" [innerHTML]="item.courseName"></h3>
//                             <h4 style="margin:2px 0 0; font-size: 13px; color: #909090;"
//                                 [innerHTML]="item.collegeName">
//                             </h4>
//                             <div style="margin: 7px 0 5px;">
//                                 <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
//                                             font-size: 10px;color: #909090;">
//                                     {{ item.yearOfPassing | date: 'yyyy' }}
//                                 </p>
//                                 <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
//                                             font-size: 10px;color: #909090;text-align: right;"
//                                     [innerHTML]="item.universityName">
//                                 </p>
//                             </div>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//         <ng-container *ngIf="additionalInfo.length > 0">
//             <tr>
//                 <td style="height: 25px;"></td>
//             </tr>
//             <tr>
//                 <td style="padding: 0 20px">
//                     <table cellspacing="0" cellpadding="0" style="width: 100%">
//                         <tr>
//                             <td>
//                                 <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Other Details
//                                 </h2>
//                             </td>
//                         </tr>
//                         <tr *ngFor="let item of additionalInfo">
//                             <td style="font-size: 0; padding: 10px;">
//                                 <h3 style="margin:0; font-size: 14px;" [innerHTML]="item.type"></h3>
//                                 <ng-container [ngSwitch]="item.type">
//                                     <ng-container *ngSwitchCase="'Accomplishments'">
//                                        <p [innerHTML]="item.value"></p>
//                                     </ng-container>
//                                     <ng-container *ngSwitchCase="'Affiliations'">
//                                        <p [innerHTML]="item.value"></p>
//                                     </ng-container>
//                                     <ng-container *ngSwitchCase="'Certifications'">
//                                        <div style="width: 50%;padding-right: 15px;vertical-align: top;" *ngFor="let data of item.value">
//                                             <h3 style="margin:0; font-size: 12px;">
//                                             {{ data.certificate }}
//                                             </h3>
//                                             <p style="display:inline-block;margin:0;font-style: italic;font-size: 10px;color: #909090;">
//                                                 {{ data.date | date: 'yyyy' }}
//                                             </p>
//                                         </div>
//                                     </ng-container>
//                                     <ng-container *ngSwitchDefault>
//                                         <h4 style="margin:2px 0 0; font-size: 13px; color: #909090;" *ngFor="let data of item.value">
//                                             {{data}}
//                                         </h4>
//                                     </ng-container>
//                                 </ng-container>
//                             </td>
//                         </tr>
//                     </table>
//                 </td>
//             </tr>
//         </ng-container>
//     </table>
// </div>
// `;


export const templateMock = `
<div style="margin-top: 20px;"><table cellspacing="0" cellpadding="0" style="font-family: sans-serif; width: 800px; margin: auto;color: #444444;"><tr><td style="padding: 0 20px"><table cellspacing="0" cellpadding="0" style="width: 100%"><tr><td><h1 style="margin: 0 0 5px; font-size: 24px;font-weight: 500;color: #444444;"><span *ngIf="templateForm.firstName">{{templateForm.firstName}} </span><span *ngIf="!templateForm.firstName">John </span><span *ngIf="templateForm.lastName ">{{templateForm.lastName}}</span><span *ngIf="!templateForm.lastName">Doe</span></h1><h4 style="margin: 0 0 5px; font-size: 16px;font-weight: 500;color: #8c8c8cdd;">{{ templateForm.designation }}</h4><p style="margin: 0; font-size: 13px;color: #444444;" [innerHTML]="careerObjective"></p></td></tr></table></td></tr><tr><td style="height: 15px;"></td></tr><tr><td style="background: #eaeaea;padding: 0 30px"><table cellspacing="0" cellpadding="0" style="width: 100%"><tr><td style="font-size: 12px; padding: 10px 10px;"><div style="white-space: nowrap;"><img style="width: 14px;display: inline-block;vertical-align: middle;"
src="assets/icons/template-icons/envelope.svg" alt=""><span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
*ngIf="templateForm.email" [innerHTML]="templateForm.email"></span>
 <span style="margin-left: 3px;display: inline-block;vertical-align: middle;" *ngIf="!templateForm.email">john.doe@gmail.com </span></div></td><td style="font-size: 12px; padding: 10px 10px;"><div style="white-space: nowrap;"><img style="width: 14px;display: inline-block;vertical-align: middle;" src="assets/icons/template-icons/mobile.svg" alt="mobile"> <span style="margin-left: 3px;display: inline-block;vertical-align: middle;" *ngIf="templateForm.contactNumber" [innerHTML]="templateForm.contactNumber"> </span> <span style="margin-left: 3px;display: inline-block;vertical-align: middle;" *ngIf="!templateForm.contactNumber">1234567890</span></div>
</td><td style="font-size: 12px; padding: 10px 10px;"> <div style="white-space: nowrap;"> <img style="width: 14px;display: inline-block;vertical-align: middle;" src="assets/icons/template-icons/location.svg" alt="location"><span style="margin-left: 3px;display: inline-block;vertical-align: middle;"  *ngIf="templateForm.fullAddress" [innerHTML]="templateForm.fullAddress">                                </span><span style="margin-left: 3px;display: inline-block;vertical-align: middle;"
                                   *ngIf="!templateForm.fullAddress"> Lorem ipsum dolor met </span> </div> </td> <td style="font-size: 12px; padding: 10px 10px;">  <div style="white-space: nowrap;">
                               <img style="width: 14px;display: inline-block;vertical-align: middle;"
                                   src="assets/icons/template-icons/linkedin.svg" alt="">
                               <span
                                   style="margin-left: 3px;display: inline-block;vertical-align: middle;">linkedin.com/in/john.doe</span>
                           </div>
                       </td>
                       <td style="font-size: 12px; padding: 10px 10px;">
                           <div style="white-space: nowrap;">
                               <img style="width: 14px;display: inline-block;vertical-align: middle;"
                                   src="assets/icons/template-icons/skype.svg" alt="">
                               <span
                                   style="margin-left: 3px;display: inline-block;vertical-align: middle;">john.doe</span>
                           </div>
                       </td>
                   </tr>
               </table>
           </td>
       </tr>
       <tr>
           <td style="height: 15px;"></td>
       </tr>
       <tr *ngIf="skillData.length > 0">
           <td style="padding: 0 20px">
               <table cellspacing="0" cellpadding="0" style="width: 100%">
                   <tr>
                       <td style="font-size: 0;">
                           <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Areas of expertise</h2>
                           <p style="margin: 2px 0;font-size: 12px; width: 25%; transition: box-shadow 280ms cubic-bezier(.4,0,.2,1);
                               display: inline-flex; padding: 7px 12px; border-radius: 16px; min-height: 32px;
                               height: 1px;"  *ngFor="let item of skillData" [ngStyle]="{'color': fontColor ,
                               'background-color' : backColor}">
                               {{ item.skillName }}
                           </p>
                       </td>
                   </tr>
               </table>
           </td>
       </tr>
       <tr>
           <td style="height: 25px;"></td>
       </tr>
       <tr *ngIf="experienceData.length > 0">
           <td style="padding: 0 20px">
               <table cellspacing="0" cellpadding="0" style="width: 100%">
                   <tr>
                       <td>
                           <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Work experience
                           </h2>
                       </td>
                   </tr>
                   <tr *ngFor="let item of experienceData">
                       <td style="font-size: 0; padding: 10px;">
                           <h3 style="margin:0; font-size: 14px;" [innerHTML]="item.designation"></h3>
                           <h4 style="margin:2px 0 0; font-size: 13px; color: #909090;"
                               [innerHTML]="item.companyName">
                           </h4>
                           <div style="margin: 7px 0 5px;">
                               <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
                                           font-size: 10px;color: #909090;">
                                   {{ item.joiningDate | date: 'LLLL yyyy' }} -
                                   {{  item.leavingDate | date: 'LLLL yyyy' }}
                               </p>
                               <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
                                           font-size: 10px;color: #909090;text-align: right;"
                                   [innerHTML]="item.location">
                               </p>
                           </div>
                       </td>
                   </tr>
               </table>
           </td>
       </tr>
       <tr>
           <td style="height: 25px;"></td>
       </tr>
       <tr *ngIf="educationData.length > 0">
           <td style="padding: 0 20px">
               <table cellspacing="0" cellpadding="0" style="width: 100%">
                   <tr>
                       <td>
                           <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Education Summary
                           </h2>
                       </td>
                   </tr>
                   <tr *ngFor="let item of educationData">
                       <td style="font-size: 0; padding: 10px;">
                           <h3 style="margin:0; font-size: 14px;" [innerHTML]="item.courseName"></h3>
                           <h4 style="margin:2px 0 0; font-size: 13px; color: #909090;"
                               [innerHTML]="item.collegeName">
                           </h4>
                           <div style="margin: 7px 0 5px;">
                               <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
                                           font-size: 10px;color: #909090;">
                                   {{ item.yearOfPassing | date: 'yyyy' }}
                               </p>
                               <p style="display:inline-block;width: 50%;margin:0;font-style: italic;
                                           font-size: 10px;color: #909090;text-align: right;"
                                   [innerHTML]="item.universityName">
                               </p>
                           </div>
                       </td>
                   </tr>
               </table>
           </td>
       </tr>
       <ng-container *ngIf="additionalInfo.length > 0">
           <tr>
               <td style="height: 25px;"></td>
           </tr>
           <tr>
               <td style="padding: 0 20px">
                   <table cellspacing="0" cellpadding="0" style="width: 100%">
                       <tr>
                           <td>
                               <h2 style="margin:0 0 5px; font-size: 16px; text-transform: uppercase">Other Details
                               </h2>
                           </td>
                       </tr>
                       <tr *ngFor="let item of additionalInfo">
                           <td style="font-size: 0; padding: 10px;">
                               <h3 style="margin:0; font-size: 14px;" [innerHTML]="item.type"></h3>
                               <ng-container [ngSwitch]="item.type">
                                   <ng-container *ngSwitchCase="'Accomplishments'">
                                      <p [innerHTML]="item.value"></p>
                                   </ng-container>
                                   <ng-container *ngSwitchCase="'Affiliations'">
                                      <p [innerHTML]="item.value"></p>
                                   </ng-container>
                                   <ng-container *ngSwitchCase="'Certifications'">
                                      <div style="width: 50%;padding-right: 15px;vertical-align: top;" *ngFor="let data of item.value">
                                           <h3 style="margin:0; font-size: 12px;">
                                           {{ data.certificate }}
                                           </h3>
                                           <p style="display:inline-block;margin:0;font-style: italic;font-size: 10px;color: #909090;">
                                               {{ data.date | date: 'yyyy' }}
                                           </p>
                                       </div>
                                   </ng-container>
                                   <ng-container *ngSwitchDefault>
                                       <h4 style="margin:2px 0 0; font-size: 13px; color: #909090;" *ngFor="let data of item.value">
                                           {{data}}
                                       </h4>
                                   </ng-container>
                               </ng-container>
                           </td>
                       </tr>
                   </table>
               </td>
           </tr>
       </ng-container>
   </table>
</div>
`;
