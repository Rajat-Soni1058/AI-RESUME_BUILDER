import React, { useEffect,useState } from 'react'
import {Link, useParams } from 'react-router-dom';
import PersonalInfoForm from "../components/personalinfoform.jsx";
import ResumePreview from "../components/resumepreview.jsx"
import TemplateSelector from "../components/templateselector.jsx"
import ExperienceForm from "../components/experience.jsx"
import ProfessionalSummaryForm from "../components/professionalsummary.jsx"
import EducationForm from "../components/education.jsx"
import ProjectForm from "../components/project.jsx"
import SkillsForm from "../components/skill.jsx"
import { ArrowLeftIcon,User ,FileText,Briefcase,GraduationCap,FolderIcon,Sparkles,ChevronLeft, ChevronRight, DownloadIcon } from 'lucide-react';
import ColorPicker from '../components/colorpicker.jsx';
import {useSelector} from "react-redux"
import toast from "react-hot-toast";
import api from "../configs/api.js";

const ResumeBuilder=()=>{
  const {resumeId}=useParams()
  const {token} = useSelector(state=>state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
  });

  const loadExistingResume = async () => {
    try {
      const {data} = await api.get('/api/resumes/get/' + resumeId, {
        headers: { Authorization: token }
      })
      if(data.resume){
        setResumeData(data.resume)
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles },
  ];

  const activeSection=sections[activeSectionIndex]||{};

  useEffect(()=>{
    loadExistingResume()
  },[])

  const downloadresume=()=>{
    window.print();
  }

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData)

      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === 'object' &&
        formData.append("image", resumeData.personal_info.image)

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      })

      setResumeData(data.resume)
      toast.success(data.message)

    } catch (error) {
      console.log(error.message);
    }
  }

  return(
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/app" className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all">
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left Panel */}
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <TemplateSelector
              selectedTemplate={resumeData.template}
              onChange={(template) =>
                setResumeData(prev => ({ ...prev, template }))
              }
            />
            <ColorPicker
              selectedColor={resumeData.accent_color}
              onChange={(color) =>
                setResumeData(prev => ({ ...prev, accent_color: color }))
              }
            />

            <div className="flex justify-between my-4">
              {activeSectionIndex !== 0 && (
                <button onClick={()=>setActiveSectionIndex(i=>i-1)} className="text-sm">
                  <ChevronLeft className="inline size-4"/> Previous
                </button>
              )}
              {activeSectionIndex !== sections.length-1 && (
                <button onClick={()=>setActiveSectionIndex(i=>i+1)} className="text-sm">
                  Next <ChevronRight className="inline size-4"/>
                </button>
              )}
            </div>

            {activeSection.id === 'personal' && (
              <PersonalInfoForm
                data={resumeData.personal_info}
                onChange={(data)=>setResumeData(p=>({...p, personal_info:data}))}
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
              />
            )}
            {activeSection.id === 'summary' && (
              <ProfessionalSummaryForm
                data={resumeData.professional_summary}
                onChange={(data)=>setResumeData(p=>({...p, professional_summary:data}))}
                setResumeData={setResumeData}
              />
            )}
            {activeSection.id === 'experience' && (
              <ExperienceForm data={resumeData.experience}
                onChange={(data)=>setResumeData(p=>({...p, experience:data}))}/>
            )}
            {activeSection.id === 'education' && (
              <EducationForm data={resumeData.education}
                onChange={(data)=>setResumeData(p=>({...p, education:data}))}/>
            )}
            {activeSection.id === 'projects' && (
              <ProjectForm data={resumeData.project}
                onChange={(data)=>setResumeData(p=>({...p, project:data}))}/>
            )}
            {activeSection.id === 'skills' && (
              <SkillsForm data={resumeData.skills}
                onChange={(data)=>setResumeData(p=>({...p, skills:data}))}/>
            )}

            <button
              onClick={()=>toast.promise(saveResume,{loading:'Saving...'})}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
            >
              Save Changes
            </button>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-7">
            <div className="flex justify-end mb-3">
              <button
                onClick={downloadresume}
                className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring"
              >
                <DownloadIcon className="size-4"/> Download
              </button>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
